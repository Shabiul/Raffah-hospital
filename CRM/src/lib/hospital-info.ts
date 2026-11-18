// Clinic identity used wherever the DB-backed ClinicSettings row hasn't loaded yet
// (print templates, notifications). Values come from prisma/dentizz-data.json. Edit that file
// (or Website Content → Settings in this CRM), not this file.
import data from "../../prisma/dentizz-data.json"

export const CLINIC_INFO = {
  name: data.biz.name,
  address: data.biz.address,
  landmark: "",
  phone: data.biz.phone,
  email: data.biz.email,
  tagline: data.biz.tagline,
}
