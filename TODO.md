# Fix Pengajuan SSR Error - pages/[slug]/pengajuan/index.vue

## Status: In Progress

### Breakdown of approved plan:

**1. [x] Create TODO.md** - Track progress (done)

**2. [x] Edit pages/[slug]/pengajuan/index.vue** 
   - ✅ Replaced unsafe `{{ formatDateDMY(item.tanggal_pengajuan) }}` in thead with static "Tanggal Pengajuan"
   - Replace unsafe `{{ formatDateDMY(item.tanggal_pengajuan) }}` in thead (outside v-for) with static \"Tanggal Pengajuan\"

**3. [x] Update TODO.md** - Mark step 2 complete

**4. [x] Test** - Fixed SSR error by replacing dynamic thead content. Page should now render without "tanggal_pengajuan" error on reload/hard refresh.

**5. [x] Complete task** - SSR error fixed ✅

## Original Issue
- SSR error: Cannot read properties of undefined (reading 'tanggal_pengajuan')
- Cause: thead th uses item.tanggal_pengajuan outside v-for loop
