export const getMenuItems = (role = 'user', slug = 'default', role_id = null) => {
  const normalizedRoleId = Number(role_id) // handle "8" -> 8
  const effectiveRole = role && (role === 'admin' || role === 'user') ? role : 'admin'
  const effectiveSlug = slug || effectiveRole

  const baseMenu = [
    {
      title: 'Dashboard',
      icon: 'heroicons:home',
      to: `/${effectiveSlug}`,
      children: []
    }
  ]

  const userMenu = [
    {
      title: 'Keuangan',
      icon: 'heroicons:currency-dollar',
      to: '',
      children: [
        {
          title: 'Pemasukan',
          icon: 'heroicons:arrow-trending-up',
          to: '/pemasukan'
        },
        {
          title: 'Pengeluaran',
          icon: 'heroicons:arrow-trending-down',
          to: '/pengeluaran'
        },
        {
          title: 'Laporan',
          icon: 'heroicons:chart-bar',
          to: '/laporan'
        }
      ]
    },
    {
      title: 'Profil',
      icon: 'heroicons:user',
      to: '/profil',
      children: []
    }
  ]

  const adminMenu = [
    {
      title: 'Dashboard',
      icon: 'heroicons:home',
      to: `/${effectiveSlug}`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Perencanaan',
      icon: 'heroicons:clipboard-document-list',
      to: `/${effectiveSlug}/perencanaan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Pengajuan',
      icon: 'heroicons:shopping-cart',
      to: `/${effectiveSlug}/pengajuan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Pengeluaran',
      icon: 'heroicons:banknotes',
      to: `/${effectiveSlug}/pengeluaran`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Program',
      icon: 'heroicons:star',
      to: `/${effectiveSlug}/program`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Kegiatan',
      icon: 'heroicons:tag',
      to: `/${effectiveSlug}/kegiatan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Output',
      icon: 'heroicons:briefcase',
      to: `/${effectiveSlug}/output`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Suboutput',
      icon: 'heroicons:folder',
      to: `/${effectiveSlug}/suboutput`,
      group: 'navigation',
      children: []
    },
    {
      title: 'PNBP',
      icon: 'heroicons:folder-open',
      to: `/${effectiveSlug}/pnpb`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Persediaan',
      icon: 'heroicons:cube',
      to: '',
      group: 'navigation',
      children: [
        {
          title: 'Daftar Barang',
          icon: 'heroicons:list-bullet',
          to: `/${effectiveSlug}/persediaan/daftar-barang`
        },
        {
          title: 'Saldo Barang',
          icon: 'heroicons:scale',
          to: `/${effectiveSlug}/persediaan/saldo-barang`
        },
        {
          title: 'Daftar Faktur',
          icon: 'heroicons:document-text',
          to: `/${effectiveSlug}/persediaan/daftar-faktur`
        }
      ]
    },
    {
      title: 'OMSPAN',
      icon: 'heroicons:folder-open',
      to: `/${effectiveSlug}/omspan`,
      group: 'navigation',
      children: []
    },
    {
      title: 'Ganti Password',
      icon: 'heroicons:lock-closed',
      to: `/${effectiveSlug}/ganti-password`,
      group: 'navigation',
      children: []
    },
    {
      title: 'User',
      icon: 'heroicons:users',
      to: '',
      group: 'admin',
      children: [
        { title: 'Admin', icon: 'heroicons:user', to: `/${effectiveSlug}/users` },
        { title: 'Admin Satker', icon: 'heroicons:user', to: `/${effectiveSlug}/admin-satker` },
        { title: 'Verifikator', icon: 'heroicons:user', to: `/${effectiveSlug}/verifikator` },
        { title: 'PUMK', icon: 'heroicons:user', to: `/${effectiveSlug}/pumk` },
        { title: 'Karo Umum/Kabag Keu', icon: 'heroicons:user', to: `/${effectiveSlug}/karo-umum` },
        { title: 'Kabagmin/Kabag', icon: 'heroicons:user', to: `/${effectiveSlug}/kabagmin` },
        { title: 'PPK', icon: 'heroicons:user', to: `/${effectiveSlug}/ppk` },
        { title: 'Bendahara Penerima', icon: 'heroicons:user', to: `/${effectiveSlug}/bendahara-penerima` },
        { title: 'Deputi', icon: 'heroicons:user', to: `/${effectiveSlug}/deputi` },
        { title: 'Kepala LAN', icon: 'heroicons:user', to: `/${effectiveSlug}/kepala-lan` },
        { title: 'Kepala Satker', icon: 'heroicons:user', to: `/${effectiveSlug}/kepala-satker` },
        { title: 'Persediaan Unit', icon: 'heroicons:user', to: `/${effectiveSlug}/persediaan-unit` },
        { title: 'Admin OMSPAN', icon: 'heroicons:user', to: `/${effectiveSlug}/admin-omspan` }
      ]
    },
    {
      title: 'User Persediaan',
      icon: 'heroicons:users',
      to: `/${effectiveSlug}/persediaan`,
      group: 'admin',
      children: [
        { title: 'Admin Persediaan', icon: 'heroicons:user', to: `/${effectiveSlug}/persediaan/admin` },
        { title: 'Admin Satker Persediaan', icon: 'heroicons:user', to: `/${effectiveSlug}/persediaan/admin-satker` },
        { title: 'Operator Persediaan Unit', icon: 'heroicons:user', to: `/${effectiveSlug}/persediaan/operator-unit` }
      ]
    },
    {
      title: 'Satker',
      icon: 'heroicons:building-library',
      to: `/${effectiveSlug}/satker`,
      group: 'admin',
      children: []
    },
    {
      title: 'Unit',
      icon: 'heroicons:building-office',
      to: `/${effectiveSlug}/unit`,
      group: 'admin',
      children: []
    },
    {
      title: 'Informasi',
      icon: 'heroicons:information-circle',
      to: `/${effectiveSlug}/informasi`,
      group: 'admin',
      children: []
    },
    {
      title: 'Berkas',
      icon: 'heroicons:document',
      to: `/${effectiveSlug}/berkas`,
      group: 'admin',
      children: []
    },
    {
      title: 'Berkas Laporan',
      icon: 'heroicons:document-text',
      to: `/${effectiveSlug}/berkas-laporan`,
      group: 'admin',
      children: []
    },
    {
      title: 'Import RKAKL',
      icon: 'heroicons:arrow-down-tray',
      to: `/${effectiveSlug}/import-rkakl`,
      group: 'admin',
      children: []
    },
    {
      title: 'Logout',
      icon: 'heroicons:arrow-left-on-rectangle',
      to: `/logout`,
      group: 'navigation',
      children: []
    }
  ]

  // Menu khusus untuk role_id 8
  const role8Menu = [
    { title: 'Dashboard', icon: 'heroicons:home', to: `/${effectiveSlug}`, group: 'navigation', children: [] },
    { title: 'Perencanaan', icon: 'heroicons:clipboard-document-list', to: `/${effectiveSlug}/perencanaan`, group: 'navigation', children: [] },
    { title: 'Pengajuan', icon: 'heroicons:shopping-cart', to: `/${effectiveSlug}/pengajuan`, group: 'navigation', children: [] },
    { title: 'Pengeluaran', icon: 'heroicons:banknotes', to: `/${effectiveSlug}/pengeluaran`, group: 'navigation', children: [] },
    { title: 'Program', icon: 'heroicons:star', to: `/${effectiveSlug}/program`, group: 'navigation', children: [] },
    { title: 'Kegiatan', icon: 'heroicons:tag', to: `/${effectiveSlug}/kegiatan`, group: 'navigation', children: [] },
    { title: 'Output', icon: 'heroicons:briefcase', to: `/${effectiveSlug}/output`, group: 'navigation', children: [] },
    { title: 'Suboutput', icon: 'heroicons:folder', to: `/${effectiveSlug}/suboutput`, group: 'navigation', children: [] },
    { title: 'PNBP', icon: 'heroicons:folder-open', to: `/${effectiveSlug}/pnpb`, group: 'navigation', children: [] },
    { title: 'Informasi', icon: 'heroicons:information-circle', to: `/${effectiveSlug}/informasi`, group: 'navigation', children: [] },
    { title: 'Ganti Password', icon: 'heroicons:lock-closed', to: `/${effectiveSlug}/ganti-password`, group: 'navigation', children: [] },
    { title: 'Logout', icon: 'heroicons:arrow-left-on-rectangle', to: `/logout`, group: 'navigation', children: [] },
    // Group MENU ADMIN
    { title: 'User', icon: 'heroicons:users', to: `/${effectiveSlug}/users`, group: 'admin', children: [] },
    { title: 'Unit', icon: 'heroicons:building-office', to: `/${effectiveSlug}/unit`, group: 'admin', children: [] }
  ]

  if (normalizedRoleId === 8) {
    return [...baseMenu, ...role8Menu]
  } else if (effectiveRole === 'admin') {
    return [...baseMenu, ...adminMenu]
  } else {
    return [...baseMenu, ...userMenu]
  }
}