<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const showAlert = ref(true)
const kegiatan = ref('')
const satker = ref('1')
const kode = ref('')
const nama = ref('')
const tahun = ref('2026')

const kegiatanList = [
  { value: '', label: '- Pilih Kegiatan -' },
  { value: '109', label: '3577 - Peningkatan Koordinasi Perencanaan, Hukum, Humas Dan Keprotokolan Dalam Lingkup LAN' },
  { value: '110', label: '3578 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro Umum LAN' },
  { value: '111', label: '3579 - Pengawasan dalam Rangka Akuntabilitas Publik' },
  { value: '112', label: '3587 - Pembangunan Sarana dan Prasarana Aparatur LAN' },
  { value: '113', label: '3595 - Pengembangan Program Dan Pembinaan Diklat' },
  { value: '114', label: '3596 - Pembinaan Widyaiswara' },
  { value: '115', label: '3601 - Promosi Inovasi Dan Pengembangan Kapasitas' },
  { value: '116', label: '3602 - Pengkajian Sistem Dan Hukum Administrasi Negara' },
  { value: '117', label: '3603 - Inovasi Kelembagaan Dan Sumber Daya Aparatur' },
  { value: '118', label: '3604 - Pengkajian Desentralisasi Dan Otonomi Daerah' },
  { value: '119', label: '3605 - Pengkajian Reformasi Administrasi' },
  { value: '120', label: '3606 - Pembinaan Analis Kebijakan' },
  { value: '121', label: '3607 - Inovasi Pelayanan Publik' },
  { value: '122', label: '3608 - Inovasi Tata Pemerintahan' },
  { value: '123', label: '3609 - Peningkatan Kualitas Penyelenggaraan Diklat Kepemimpinan Aparatur Nasional' },
  { value: '124', label: '3610 - Penyelenggaraan Diklat Teknis Dan Fungsional' },
  { value: '179', label: '3577 - Peningkatan Koordinasi Perencanaan, Hukum, Humas Dan Keprotokolan Dalam Lingkup LAN' },
  { value: '180', label: '3578 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro Umum LAN' },
  { value: '181', label: '3579 - Pengawasan dalam Rangka Akuntabilitas Publik' },
  { value: '182', label: '3587 - Pembangunan Sarana dan Prasarana Aparatur LAN' },
  { value: '183', label: '3595 - Pengembangan Program Dan Pembinaan Diklat' },
  { value: '184', label: '3596 - Pembinaan Widyaiswara' },
  { value: '185', label: '3601 - Promosi Inovasi Dan Pengembangan Kapasitas' },
  { value: '186', label: '3602 - Pengkajian Sistem Dan Hukum Administrasi Negara' },
  { value: '187', label: '3603 - Inovasi Kelembagaan Dan Sumber Daya Aparatur' },
  { value: '188', label: '3604 - Pengkajian Desentralisasi Dan Otonomi Daerah' },
  { value: '189', label: '3605 - Pengkajian Reformasi Administrasi' },
  { value: '190', label: '3606 - Pembinaan Analis Kebijakan' },
  { value: '191', label: '3607 - Inovasi Pelayanan Publik' },
  { value: '192', label: '3608 - Inovasi Tata Pemerintahan' },
  { value: '193', label: '3609 - Peningkatan Kualitas Penyelenggaraan Diklat Kepemimpinan Aparatur Nasional' },
  { value: '194', label: '3610 - Penyelenggaraan Diklat Teknis Dan Fungsional' },
  { value: '221', label: '3577 - Peningkatan Koordinasi Perencanaan, Hukum, Humas Dan Keprotokolan Dalam Lingkup LAN' },
  { value: '222', label: '3578 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro Umum LAN' },
  { value: '223', label: '3579 - Pengawasan dalam Rangka Akuntabilitas Publik' },
  { value: '224', label: '3587 - Pembangunan Sarana dan Prasarana Aparatur LAN' },
  { value: '225', label: '3595 - Pengembangan Program Dan Pembinaan Diklat' },
  { value: '226', label: '3596 - Pembinaan Widyaiswara' },
  { value: '227', label: '3601 - Promosi Inovasi Dan Pengembangan Kapasitas' },
  { value: '228', label: '3602 - Pengkajian Sistem Dan Hukum Administrasi Negara' },
  { value: '229', label: '3603 - Inovasi Kelembagaan Dan Sumber Daya Aparatur' },
  { value: '230', label: '3604 - Pengkajian Desentralisasi Dan Otonomi Daerah' },
  { value: '231', label: '3605 - Pengkajian Reformasi Administrasi' },
  { value: '232', label: '3606 - Pembinaan Analis Kebijakan' },
  { value: '233', label: '3607 - Inovasi Pelayanan Publik' },
  { value: '234', label: '3608 - Inovasi Tata Pemerintahan' },
  { value: '235', label: '3609 - Peningkatan Kualitas Penyelenggaraan Diklat Kepemimpinan Aparatur Nasional' },
  { value: '236', label: '3610 - Penyelenggaraan Diklat Teknis Dan Fungsional' },
  { value: '307', label: '3577 - Peningkatan Koordinasi Perencanaan, Hukum, Humas Dan Keprotokolan Dalam Lingkup LAN' },
  { value: '308', label: '3578 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro Umum LAN' },
  { value: '309', label: '3579 - Pengawasan dalam Rangka Akuntabilitas Publik' },
  { value: '310', label: '3587 - Pembangunan Sarana dan Prasarana Aparatur LAN' },
  { value: '311', label: '3595 - Pengembangan Program Dan Pembinaan Diklat' },
  { value: '316', label: '3604 - Pengkajian Desentralisasi Dan Otonomi Daerah' },
  { value: '317', label: '3605 - Pengkajian Reformasi Administrasi' },
  { value: '318', label: '3606 - Pembinaan Analis Kebijakan' },
  { value: '321', label: '3609 - Peningkatan Kualitas Penyelenggaraan Diklat Kepemimpinan Aparatur Nasional' },
  { value: '322', label: '3610 - Penyelenggaraan Diklat Teknis Dan Fungsional' },
  { value: '323', label: '3577 - Peningkatan Koordinasi Perencanaan, Hukum, Humas Dan Keprotokolan Dalam Lingkup LAN' },
  { value: '324', label: '4154 - Peningkatan Koordinasi Perencanaan dan Keuangan LAN' },
  { value: '325', label: '4155 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro SDM dan Umum LAN' },
  { value: '326', label: '4156 - Peningkatan Koordinasi Hukum dan Hubungan Masyarakat LAN' },
  { value: '327', label: '4161 - Inovasi Adminsitrasi Negara' },
  { value: '328', label: '4162 - Pengkajian Kebijakan Administrasi Negara' },
  { value: '329', label: '4163 - Pengkajian Manajemen Aparatur Sipil Negara' },
  { value: '330', label: '4164 - Inovasi Manajemen Pengembangan Kompetensi ASN' },
  { value: '331', label: '4165 - Perancangan Teknologi Pengembangan Kompetensi' },
  { value: '332', label: '4166 - Pembinaan Program Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '333', label: '4167 - Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '334', label: '4168 - Penyelenggaraan Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara' },
  { value: '335', label: '4169 - Penyelenggaraan Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara' },
  { value: '336', label: '4170 - Penyelenggaraan Standarisasi Pembentukan Karakter Dasar dan Kader ASN' },
  { value: '337', label: '4175 - Pengelolaan Data dan Sistem Informasi Administrasi Negara' },
  { value: '345', label: '3579 - Pengawasan dalam Rangka Akuntabilitas Publik' },
  { value: '346', label: '4154 - Peningkatan Koordinasi Perencanaan dan Keuangan LAN' },
  { value: '347', label: '4155 - Pembinaan Administrasi dan Pengelolaan Pelayanan Penunjang Pelaksanaan Tupoksi Biro SDM dan Umum LAN' },
  { value: '348', label: '4156 - Peningkatan Koordinasi Hukum dan Hubungan Masyarakat LAN' },
  { value: '349', label: '4236 - Pengelolaan Data dan Sistem Informasi Administrasi Negara' },
  { value: '350', label: '3587 - Pembangunan Sarana dan Prasarana Aparatur LAN' },
  { value: '351', label: '3606 - Pembinaan Analis Kebijakan' },
  { value: '352', label: '4161 - Inovasi Administrasi Negara' },
  { value: '353', label: '4162 - Pengkajian Kebijakan Administrasi Negara' },
  { value: '354', label: '4163 - Pengkajian Manajemen Aparatur Sipil Negara' },
  { value: '355', label: '4164 - Inovasi Manajemen Pengembangan Kompetensi ASN' },
  { value: '356', label: '4165 - Perancangan Teknologi Pengembangan Kompetensi' },
  { value: '357', label: '4166 - Pembinaan Program Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '358', label: '4167 - Pembinaan Jabatan Fungsional Bidang Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '359', label: '4168 - Penyelenggaraan Pengembangan Kompetensi Kepemimpinan Nasional dan Manajerial Aparatur Sipil Negara' },
  { value: '360', label: '4169 - Penyelenggaraan Pengembangan Kompetensi Teknis dan Sosial Kultural Aparatur Sipil Negara' },
  { value: '361', label: '4170 - Penyelenggaraan Standarisasi Pembentukan Karakter Dasar dan Kader ASN' },
  { value: '381', label: 'Kode - Deskripsi' },
  { value: '382', label: '4824 - Pembinaan Jabatan Fungsional Administrasi Negara' },
  { value: '383', label: '4825 - Pengkajian Kebijakan Dan Pengembangan Inovasi Administrasi Negara' },
  { value: '384', label: '4826 - Pengkajian Kebijakan dan Pengembangan Inovasi Manajemen Aparatur Sipil Negara' },
  { value: '385', label: '4827 - Penyusunan Kebijakan Dan Penyelenggaraan Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '386', label: '3579 - Pengawasan Resiko, Pengendalian, dan Pengawasan Internal' },
  { value: '387', label: '4821 - Peningkatan Koordinasi Perencanaan dan Keuangan' },
  { value: '388', label: '4822 - Pembinaan Administrasi serta Pengelolaan Pelayanan SDM dan Umum' },
  { value: '389', label: '4823 - Peningkatan Koordinasi Hukum, Organisasi, Data, dan Sistem Informasi' },
  { value: '440', label: 'Kode - Deskripsi' },
  { value: '441', label: '4824 - Pembinaan Jabatan Fungsional Administrasi Negara' },
  { value: '442', label: '4825 - Pengkajian Kebijakan Dan Pengembangan Inovasi Administrasi Negara' },
  { value: '443', label: '4826 - Pengkajian Kebijakan dan Pengembangan Inovasi Manajemen Aparatur Sipil Negara' },
  { value: '444', label: '4827 - Penyusunan Kebijakan Dan Penyelenggaraan Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '445', label: '3579 - Pengawasan Resiko, Pengendalian, dan Pengawasan Internal' },
  { value: '446', label: '4821 - Peningkatan Koordinasi Perencanaan dan Keuangan' },
  { value: '447', label: '4822 - Pembinaan Administrasi serta Pengelolaan Pelayanan SDM dan Umum' },
  { value: '448', label: '4823 - Peningkatan Koordinasi Hukum, Organisasi, Data, dan Sistem Informasi' },
  { value: '491', label: '4824 - Pembinaan Jabatan Fungsional Administrasi Negara' },
  { value: '492', label: '4824 - Pembinaan Jabatan Fungsional Administrasi Negara' },
  { value: '493', label: '4825 - Pengkajian Kebijakan Dan Pengembangan Inovasi Administrasi Negara' },
  { value: '494', label: '4826 - Pengkajian Kebijakan dan Pengembangan Inovasi Manajemen Aparatur Sipil Negara' },
  { value: '495', label: '4827 - Penyusunan Kebijakan Dan Penyelenggaraan Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '496', label: '3579 - Pengawasan Resiko, Pengendalian, dan Pengawasan Internal' },
  { value: '497', label: '4821 - Peningkatan Koordinasi Perencanaan dan Keuangan' },
  { value: '498', label: '4822 - Pembinaan Administrasi serta Pengelolaan Pelayanan SDM dan Umum' },
  { value: '499', label: '4823 - Peningkatan Koordinasi Hukum, Organisasi, Data, dan Sistem Informasi' },
  { value: '552', label: '4824 - Pembinaan Jabatan Fungsional Administrasi Negara' },
  { value: '553', label: '4825 - Pengkajian Kebijakan Dan Pengembangan Inovasi Administrasi Negara' },
  { value: '554', label: '4826 - Pengkajian Kebijakan dan Pengembangan Inovasi Manajemen Aparatur Sipil Negara' },
  { value: '555', label: '4827 - Penyusunan Kebijakan Dan Penyelenggaraan Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '556', label: '3579 - Pengawasan Resiko, Pengendalian, dan Pengawasan Internal' },
  { value: '557', label: '4821 - Peningkatan Koordinasi Perencanaan dan Keuangan' },
  { value: '558', label: '4822 - Pembinaan Administrasi serta Pengelolaan Pelayanan SDM dan Umum' },
  { value: '559', label: '4823 - Peningkatan Koordinasi Hukum, Organisasi, Data, dan Sistem Informasi' },
  { value: '595', label: '4824 - Pembinaan Jabatan Fungsional Administrasi Negara' },
  { value: '596', label: '4825 - Pengkajian Kebijakan Dan Pengembangan Inovasi Administrasi Negara' },
  { value: '597', label: '4826 - Pengkajian Kebijakan dan Pengembangan Inovasi Manajemen Aparatur Sipil Negara' },
  { value: '598', label: '4827 - Penyusunan Kebijakan Dan Penyelenggaraan Pengembangan Kompetensi Aparatur Sipil Negara' },
  { value: '599', label: '3579 - Pengawasan Resiko, Pengendalian, dan Pengawasan Internal' },
  { value: '600', label: '4821 - Peningkatan Koordinasi Perencanaan dan Keuangan' },
  { value: '601', label: '4822 - Pembinaan Administrasi serta Pengelolaan Pelayanan SDM dan Umum' },
  { value: '602', label: '4823 - Peningkatan Koordinasi Hukum, Organisasi, Data, dan Sistem Informasi' },
  { value: '659', label: '7913 - Penguatan Kapasitas Jabatan Fungsional Bidang Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara' },
  { value: '660', label: '7914 - Peningkatan Kualitas Kebijakan Administrasi Negara' },
  { value: '661', label: '7915 - Transformasi Pembelajaran Aparatur Sipil Negara' },
  { value: '662', label: '7916 - Penyelenggaraan Pengembangan Kapasitas Aparatur Sipil Negara' },
  { value: '663', label: '7917 - Penjaminan Mutu Pengembangan Kapasitas dan Pembelajaran Aparatur Sipil Negara' },
  { value: '664', label: '7918 - Peningkatan Kualitas Layanan Umum, Kerja Sama, Hubungan Masyarakat, dan Sistem Informasi' },
  { value: '681', label: '3579 - Pengawasan Resiko, Pengendalian, dan Pengawasan Internal' },
  { value: '682', label: '4821 - Peningkatan Koordinasi Perencanaan dan Keuangan' },
  { value: '683', label: '7919 - Peningkatan Kualitas Layanan Hukum, Organisasi, dan Sumber Daya Manusia Internal' },
]

const satkerList = [
  { value: '', label: '- Pilih Satker -' },
  { value: '1', label: 'LAN JAKARTA' },
  { value: '2', label: 'PUSJAR SKTASN NAS' },
  { value: '3', label: 'PUSJAR SKMP' },
  { value: '4', label: 'PUSJAR SKPP' },
  { value: '5', label: 'PUSJAR SKMK' },
  { value: '6', label: 'STIA LAN BANDUNG' },
  { value: '7', label: 'STIA LAN JAKARTA' },
  { value: '8', label: 'STIA MAKASSAR' },
]

function submitForm() {
  // Implementasi submit sesuai kebutuhan backend
  alert('Output berhasil disimpan!')
}
</script>

<template>
  <div class="pt-14">
    <!-- ALERT -->
    <div v-if="showAlert" class="alert alert-error shadow-lg mb-6">
      <div>
        <Icon icon="mdi:alert" class="w-6 h-6" />
        <span>
          Terdapat <b>41 Sub Output</b> yang belum ditentukan unitnya.
          <NuxtLink
            to="/admin/suboutput"
            class="link link-hover underline ml-1"
          >
            Klik di sini
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- BREADCRUMB -->
    <div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700 flex items-center gap-1">
        <Icon icon="mdi:home" class="w-4 h-4" /> Dashboard
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/output" class="hover:text-blue-700">Outputs</NuxtLink>
      <span>/</span>
      <span class="font-bold text-blue-700">Create</span>
    </div>

    <!-- TITLE -->
    <h1 class="text-3xl font-bold text-blue-700 mb-6">
      SIK - Create Output
    </h1>

    <!-- CARD -->
    <div class="card bg-white shadow-xl rounded-xl border border-blue-100">
      <div class="card-body">
        <h3 class="text-xl font-bold mb-6">Form Output</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1" for="kegiatan">Kegiatan</label>
              <select v-model="kegiatan" id="kegiatan" class="select select-bordered w-full">
                <option v-for="k in kegiatanList" :key="k.value" :value="k.value">{{ k.label }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1" for="satker">Satker</label>
              <select v-model="satker" id="satker" class="select select-bordered w-full">
                <option v-for="s in satkerList" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1" for="kode">Kode</label>
              <input v-model="kode" id="kode" type="text" class="input input-bordered w-full" placeholder="Kode" />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="nama">Nama</label>
              <input v-model="nama" id="nama" type="text" class="input input-bordered w-full" placeholder="Nama" />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="tahun">Tahun</label>
              <input v-model="tahun" id="tahun" type="text" class="input input-bordered w-full" placeholder="Tahun" />
            </div>
          </div>
          <div class="mt-6">
            <button type="submit" class="btn btn-success">
              <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
