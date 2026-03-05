# Icon name mapping from tabler:xxx to IconXxx
$iconMapping = @{
    'tabler:user' = 'IconUser'
    'tabler:lock' = 'IconLock'
    'tabler:calendar' = 'IconCalendar'
    'tabler:filter' = 'IconFilter'
    'tabler:refresh' = 'IconRefresh'
    'tabler:building' = 'IconBuilding'
    'tabler:chevron-down' = 'IconChevronDown'
    'tabler:sitemap' = 'IconSitemap'
    'tabler:users-group' = 'IconUsersGroup'
    'tabler:info-circle' = 'IconInfoCircle'
    'tabler:calendar-time' = 'IconCalendarTime'
    'tabler:search' = 'IconSearch'
    'tabler:x' = 'IconX'
    'tabler:calendar-month' = 'IconCalendarMonth'
    'tabler:calendar-check' = 'IconCalendarCheck'
    'tabler:download' = 'IconDownload'
    'tabler:folder-check' = 'IconFolderCheck'
    'tabler:database-search' = 'IconDatabaseSearch'
    'tabler:eye' = 'IconEye'
    'tabler:pencil' = 'IconPencil'
    'tabler:trash' = 'IconTrash'
    'tabler:printer' = 'IconPrinter'
    'tabler:alert-circle' = 'IconAlertCircle'
    'tabler:home' = 'IconHome'
    'tabler:plus' = 'IconPlus'
    'tabler:key' = 'IconKey'
    'tabler:edit' = 'IconEdit'
    'tabler:cash' = 'IconCash'
    'tabler:shopping-cart' = 'IconShoppingCart'
    'tabler:arrow-up-circle' = 'IconArrowUpCircle'
    'tabler:copy' = 'IconCopy'
    'tabler:tags' = 'IconTags'
    'tabler:circle' = 'IconCircle'
    'tabler:chart-bar' = 'IconChartBar'
    'tabler:chart-line' = 'IconChartLine'
    'tabler:folder' = 'IconFolder'
    'tabler:inbox' = 'IconInbox'
    'tabler:edit-circle' = 'IconEditCircle'
}

# Get all Vue files except node_modules and login.vue (already processed)
$vueFiles = Get-ChildItem -Path . -Recurse -Include *.vue -Exclude login.vue,node_modules | Where-Object { $_.FullName -notmatch 'node_modules' -and $_.FullName -notmatch '\.nuxt' }

foreach ($file in $vueFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    # Check if file uses Icon from @idds/vue
    if ($content -match "import \{ Icon \} from '@idds/vue'") {
        # Find all unique icons used in this file
        $usedIcons = @()
        foreach ($iconName in $iconMapping.Keys) {
            if ($content -match [regex]::Escape("icon=`"$iconName`"")) {
                $usedIcons += $iconMapping[$iconName]
            }
        }
        
        if ($usedIcons.Count -gt 0) {
            # Replace import statement
            $iconImports = ($usedIcons | Sort-Object -Unique) -join ', '
            $content = $content -replace "import \{ Icon \} from '@idds/vue'", "import { $iconImports } from '@tabler/icons-vue'"
            
            # Replace each Icon usage with specific component
            foreach ($iconName in $iconMapping.Keys) {
                $componentName = $iconMapping[$iconName]
                $pattern = '<Icon icon="' + [regex]::Escape($iconName) + '"'
                $replacement = '<' + $componentName
                $content = $content -replace $pattern, $replacement
            }
            
            $content | Set-Content -Path $file.FullName -NoNewline -Encoding UTF8
            $modified = $true
            Write-Host "Processed: $($file.FullName)"
        }
    }
}

Write-Host "Icon conversion complete!"
