"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { istToISO } from "@/lib/format";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => str(f, k) || null;
const fail = (path: string, msg: string): never => {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}error=${encodeURIComponent(msg)}`);
};

// ------------------------------------------------------------------ auth
export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: str(formData, "email"),
    password: String(formData.get("password") ?? ""),
  });
  if (error || !data.user) return fail("/login", "Wrong email or password.");

  const { data: staff } = await supabase.from("staff").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!staff) {
    await supabase.auth.signOut();
    return fail("/login", "This account does not have access to the CRM.");
  }
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ------------------------------------------------------------------ patients
export async function createPatient(formData: FormData) {
  const supabase = await createClient();
  const age = str(formData, "age");
  const { data, error } = await supabase
    .from("patients")
    .insert({
      full_name: str(formData, "full_name"),
      phone: str(formData, "phone"),
      age: age ? Number(age) : null,
      sex: opt(formData, "sex"),
      address: opt(formData, "address"),
      notes: opt(formData, "notes"),
    })
    .select("id")
    .single();
  if (error || !data) return fail("/patients", error?.message ?? "Could not add the patient.");
  revalidatePath("/patients");
  redirect(`/patients/${data.id}`);
}

export async function updatePatient(formData: FormData) {
  const id = str(formData, "id");
  const supabase = await createClient();
  const age = str(formData, "age");
  const { error } = await supabase
    .from("patients")
    .update({
      full_name: str(formData, "full_name"),
      phone: str(formData, "phone"),
      age: age ? Number(age) : null,
      sex: opt(formData, "sex"),
      address: opt(formData, "address"),
      notes: opt(formData, "notes"),
    })
    .eq("id", id);
  if (error) return fail(`/patients/${id}`, error.message);
  revalidatePath(`/patients/${id}`);
  redirect(`/patients/${id}`);
}

// ------------------------------------------------------------------ appointments
export async function createAppointment(formData: FormData) {
  const back = str(formData, "back") || "/appointments";
  const when = str(formData, "scheduled_at");
  if (!str(formData, "patient_id") || !when) return fail(back, "Choose a patient and a time.");
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    patient_id: str(formData, "patient_id"),
    scheduled_at: istToISO(when),
    reason: opt(formData, "reason"),
  });
  if (error) return fail(back, error.message);
  revalidatePath("/appointments");
  revalidatePath("/");
  revalidatePath(back.split("?")[0]);
  redirect(back);
}

export async function setAppointmentStatus(formData: FormData) {
  const back = str(formData, "back") || "/appointments";
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: str(formData, "status") })
    .eq("id", str(formData, "id"));
  if (error) return fail(back, error.message);
  revalidatePath("/appointments");
  revalidatePath("/");
  revalidatePath(back.split("?")[0]);
  redirect(back);
}

// ------------------------------------------------------------------ billing
export async function addTreatment(formData: FormData) {
  const pid = str(formData, "patient_id");
  const back = `/patients/${pid}`;
  const amount = Number(str(formData, "amount"));
  if (!str(formData, "procedure") || !(amount >= 0)) return fail(back, "Enter a procedure and an amount.");
  const supabase = await createClient();
  const { error } = await supabase.from("treatments").insert({
    patient_id: pid,
    procedure: str(formData, "procedure"),
    tooth: opt(formData, "tooth"),
    amount,
    treated_on: str(formData, "treated_on") || undefined,
    notes: opt(formData, "notes"),
  });
  if (error) return fail(back, error.message);
  revalidatePath(back);
  revalidatePath("/billing");
  revalidatePath("/");
  redirect(back);
}

export async function addPayment(formData: FormData) {
  const pid = str(formData, "patient_id");
  const back = `/patients/${pid}`;
  const amount = Number(str(formData, "amount"));
  if (!(amount > 0)) return fail(back, "Enter a payment amount above zero.");
  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    patient_id: pid,
    amount,
    method: str(formData, "method") || "Cash",
    paid_on: str(formData, "paid_on") || undefined,
    notes: opt(formData, "notes"),
  });
  if (error) return fail(back, error.message);
  revalidatePath(back);
  revalidatePath("/billing");
  revalidatePath("/");
  redirect(back);
}

const REMOVABLE = ["treatments", "payments", "appointments"] as const;
export async function removeRow(formData: FormData) {
  const table = str(formData, "table");
  const pid = str(formData, "patient_id");
  const back = `/patients/${pid}`;
  if (!(REMOVABLE as readonly string[]).includes(table)) return fail(back, "Not allowed.");
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", str(formData, "id"));
  if (error) return fail(back, error.message);
  revalidatePath(back);
  revalidatePath("/billing");
  revalidatePath("/appointments");
  revalidatePath("/");
  redirect(back);
}

// ------------------------------------------------------------------ website requests
export async function setRequestStatus(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointment_requests")
    .update({ status: str(formData, "status") })
    .eq("id", str(formData, "id"));
  if (error) return fail("/requests", error.message);
  revalidatePath("/requests");
  revalidatePath("/");
  redirect("/requests");
}

/** Turns a website request into a patient (re-using one with the same phone) and opens their file. */
export async function convertRequest(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");
  const { data: req } = await supabase.from("appointment_requests").select("*").eq("id", id).single();
  if (!req) return fail("/requests", "Request not found.");

  const { data: existing } = await supabase.from("patients").select("id").eq("phone", req.phone).limit(1).maybeSingle();
  let patientId = existing?.id as string | undefined;
  if (!patientId) {
    const { data: created, error } = await supabase
      .from("patients")
      .insert({ full_name: req.name, phone: req.phone, notes: req.reason ? `Website request: ${req.reason}` : null })
      .select("id")
      .single();
    if (error || !created) return fail("/requests", error?.message ?? "Could not create the patient.");
    patientId = created.id;
  }
  await supabase.from("appointment_requests").update({ status: "booked" }).eq("id", id);
  revalidatePath("/requests");
  revalidatePath("/patients");
  revalidatePath("/");
  redirect(`/patients/${patientId}${req.preferred_date ? `?prefer=${req.preferred_date}` : ""}`);
}
