export const getMenuItems = (role = 'user', slug = 'default', role_id = null) => {
  const normalizedRoleId = Number(role_id) // handle "8" -> 8
  const effectiveRole = role && (role === 'admin' || role === 'user') ? role : 'admin'
  const effectiveSlug = slug || effectiveRole

  const baseMenu = [
    {
      title: 'Dashboard',
      icon: 'tabler:home',
      to: `/${effectiveSlug}`,
      children: []
    }
  ]

  const userMenu = [
    {
      title: 'Keuangan',
      icon: 'tabler:currency-dollar',
      to: '',
      children: [
        {
          title: 'Pemasukan',
          icon: 'tabler:trending-up',
          to: '/pemasukan'
        },
        {
          title: 'Pengeluaran',
          icon: 'tabler:trending-down',
          to: '/pengeluaran'
        },
        {
          title: 'Laporan',
          icon: 'tabler:chart-bar',
          to: '/laporan'
        }
      ]
    },
    {
      title: 'Profil',
      icon: 'tabler:user',
      to: '/profil',
      children: []
    }
  ]

  const adminMenu = [
    {
      title: 'Dashboard',
      icon: 'tabler:home',
      to: `/${effectiveSlug}`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Perencanaan',
      icon: 'tabler:clipboard-list',
      to: `/${effectiveSlug}/perencanaan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Pengajuan',
      icon: 'tabler:shopping-cart',
      to: `/${effectiveSlug}/pengajuan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Pengeluaran',
      icon: 'tabler:cash-banknote',
      to: `/${effectiveSlug}/pengeluaran`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Program',
      icon: 'tabler:star',
      to: `/${effectiveSlug}/program`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Kegiatan',
      icon: 'tabler:tag',
      to: `/${effectiveSlug}/kegiatan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'KRO',
      icon: 'tabler:briefcase',
      to: `/${effectiveSlug}/output`,
      group: 'navigation',
      children: []
    },
    {
      title: 'RO',
      icon: 'tabler:folder',
      to: `/${effectiveSlug}/suboutput`,
      group: 'navigation',
      children: []
    },
    {
      title: 'PNBP',
      icon: 'tabler:folder-open',
      to: `/${effectiveSlug}/pnpb`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Persediaan',
      icon: 'tabler:package',
      to: '',
      group: 'navigation',
      children: [
        {
          title: 'Daftar Barang',
          icon: 'tabler:list-details',
          to: `/${effectiveSlug}/persediaan/daftar-barang`
        },
        {
          title: 'Saldo Barang',
          icon: 'tabler:scale',
          to: `/${effectiveSlug}/persediaan/saldo-barang`
        },
        {
          title: 'Daftar Faktur',
          icon: 'tabler:file-text',
          to: `/${effectiveSlug}/persediaan/daftar-faktur`
        }
      ]
    },
    {
      title: 'OMSPAN',
      icon: 'tabler:folder-open',
      to: `/${effectiveSlug}/omspan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Ganti Password',
      icon: 'tabler:lock',
      to: `/${effectiveSlug}/ganti-password`,
      group: 'navigation',
      children: []
    },
    {
      title: 'User',
      icon: 'tabler:users',
      to: '',
      group: 'admin',
      children: [
        { title: 'Admin', icon: 'tabler:user', to: `/${effectiveSlug}/users` },
        { title: 'Admin Satker', icon: 'tabler:user', to: `/${effectiveSlug}/admin-satker` },
        { title: 'Verifikator', icon: 'tabler:user', to: `/${effectiveSlug}/verifikator` },
        { title: 'PUMK', icon: 'tabler:user', to: `/${effectiveSlug}/pumk` },
        { title: 'Karo Umum/Kabag Keu', icon: 'tabler:user', to: `/${effectiveSlug}/karo-umum` },
        { title: 'Kabagmin/Kabag', icon: 'tabler:user', to: `/${effectiveSlug}/kabagmin` },
        { title: 'PPK', icon: 'tabler:user', to: `/${effectiveSlug}/ppk` },
        { title: 'Bendahara Penerima', icon: 'tabler:user', to: `/${effectiveSlug}/bendahara-penerima` },
        { title: 'Deputi', icon: 'tabler:user', to: `/${effectiveSlug}/deputi` },
        { title: 'Kepala LAN', icon: 'tabler:user', to: `/${effectiveSlug}/kepala-lan` },
        { title: 'Kepala Satker', icon: 'tabler:user', to: `/${effectiveSlug}/kepala-satker` },
        { title: 'Persediaan Unit', icon: 'tabler:user', to: `/${effectiveSlug}/persediaan-unit` },
        { title: 'Admin OMSPAN', icon: 'tabler:user', to: `/${effectiveSlug}/admin-omspan` }
      ]
    },
    {
      title: 'User Persediaan',
      icon: 'tabler:users',
      to: `/${effectiveSlug}/persediaan`,
      group: 'admin',
      children: [
        { title: 'Admin Persediaan', icon: 'tabler:user', to: `/${effectiveSlug}/persediaan/admin` },
        { title: 'Admin Satker Persediaan', icon: 'tabler:user', to: `/${effectiveSlug}/persediaan/admin-satker` },
        { title: 'Operator Persediaan Unit', icon: 'tabler:user', to: `/${effectiveSlug}/persediaan/operator-unit` }
      ]
    },
    {
      title: 'Satker',
      icon: 'tabler:building-bank',
      to: `/${effectiveSlug}/satker`,
      group: 'admin',
      children: []
    },
    {
      title: 'Unit',
      icon: 'tabler:building',
      to: `/${effectiveSlug}/unit`,
      group: 'admin',
      children: []
    },
    {
      title: 'Informasi',
      icon: 'tabler:info-circle',
      to: `/${effectiveSlug}/informasi`,
      group: 'admin',
      children: []
    },
    {
      title: 'Berkas',
      icon: 'tabler:file-description',
      to: `/${effectiveSlug}/berkas`,
      group: 'admin',
      children: []
    },
    {
      title: 'Berkas Laporan',
      icon: 'tabler:file-text',
      to: `/${effectiveSlug}/berkas-laporan`,
      group: 'admin',
      children: []
    },
    {
      title: 'Import RKAKL',
      icon: 'tabler:file-import',
      to: `/${effectiveSlug}/import-rkakl`,
      group: 'admin',
      children: []
    },
    {
      title: 'Logout',
      icon: 'tabler:logout',
      to: `/logout`,
      group: 'navigation',
      children: []
    }
  ]

  // Menu khusus untuk role_id 8
  const role8Menu = [
    { title: 'Dashboard', icon: 'tabler:home', to: `/${effectiveSlug}`, group: 'navigation', children: [] },
    { title: 'Perencanaan', icon: 'tabler:clipboard-list', to: `/${effectiveSlug}/perencanaan`, group: 'navigation', children: [] },
    { title: 'Pengajuan', icon: 'tabler:shopping-cart', to: `/${effectiveSlug}/pengajuan`, group: 'navigation', children: [] },
    { title: 'Pengeluaran', icon: 'tabler:cash-banknote', to: `/${effectiveSlug}/pengeluaran`, group: 'navigation', children: [] },
    { title: 'Program', icon: 'tabler:star', to: `/${effectiveSlug}/program`, group: 'navigation', children: [] },
    { title: 'Kegiatan', icon: 'tabler:tag', to: `/${effectiveSlug}/kegiatan`, group: 'navigation', children: [] },
    { title: 'KRO', icon: 'tabler:briefcase', to: `/${effectiveSlug}/kro`, group: 'navigation', children: [] },
    { title: 'RO', icon: 'tabler:folder', to: `/${effectiveSlug}/ro`, group: 'navigation', children: [] },
    { title: 'PNBP', icon: 'tabler:folder-open', to: `/${effectiveSlug}/pnpb`, group: 'navigation', children: [] },
    { title: 'Informasi', icon: 'tabler:info-circle', to: `/${effectiveSlug}/informasi`, group: 'navigation', children: [] },
    { title: 'Ganti Password', icon: 'tabler:lock', to: `/${effectiveSlug}/ganti-password`, group: 'navigation', children: [] },
    { title: 'Logout', icon: 'tabler:logout', to: `/logout`, group: 'navigation', children: [] },
    // Group MENU ADMIN
    { title: 'User', icon: 'tabler:users', to: `/${effectiveSlug}/users`, group: 'admin', children: [] },
    { title: 'Unit', icon: 'tabler:building', to: `/${effectiveSlug}/unit`, group: 'admin', children: [] }
  ]

  if (normalizedRoleId === 8) {
    return [...baseMenu, ...role8Menu]
  } else if (effectiveRole === 'admin') {
    return [...baseMenu, ...adminMenu]
  } else {
    return [...baseMenu, ...userMenu]
  }
}