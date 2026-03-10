export function validateRkaklRows(rows:any[], maps:any) {

  const errors:any[] = []

  for (const r of rows) {

    if (!maps.program[r.program_kode]) {
      errors.push({
        type: "program",
        kode: r.program_kode
      })
    }

    if (!maps.kegiatan[r.kegiatan_kode]) {
      errors.push({
        type: "kegiatan",
        kode: r.kegiatan_kode
      })
    }

    if (!maps.output[r.output_kode]) {
      errors.push({
        type: "output",
        kode: r.output_kode
      })
    }

    if (!maps.suboutput[r.suboutput_kode]) {
      errors.push({
        type: "suboutput",
        kode: r.suboutput_kode
      })
    }

  }

  return errors

}