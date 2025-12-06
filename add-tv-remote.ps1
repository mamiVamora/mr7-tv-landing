# PowerShell script to add TV Remote Navigation to all pages

$cssLine = '        <link rel="stylesheet" href="css/tv-remote-styles.css">'
$jsLine = '        <!-- TV Remote Navigation -->
        <script src="js/tv-remote-navigation.js"></script>

'

$pages = @(
    "downloads.html",
    "pricing.html",
    "features.html",
    "services.html",
    "gallery.html",
    "contact.html",
    "faq.html",
    "news.html",
    "become-agent.html",
    "refund-policy.html",
    "404.html"
)

Write-Host "Adding TV Remote Navigation to all pages..." -ForegroundColor Cyan
Write-Host ""

foreach ($page in $pages) {
    $filePath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Check if already added
        if ($content -match "tv-remote-styles.css") {
            Write-Host "- $page already has CSS" -ForegroundColor Yellow
        }
        else {
            # Add CSS before </head>
            $content = $content -replace '(\s*</head>)', "`r`n$cssLine`r`n`$1"
            Write-Host "+ Added CSS to $page" -ForegroundColor Green
        }
        
        if ($content -match "tv-remote-navigation.js") {
            Write-Host "- $page already has JS" -ForegroundColor Yellow
        }
        else {
            # Add JS before AI Chatbot or before </body>
            if ($content -match '<!-- AI Chatbot -->') {
                $content = $content -replace '(\s*<!-- AI Chatbot -->)', "$jsLine`$1"
            }
            else {
                $content = $content -replace '(\s*</body>)', "`r`n$jsLine`$1"
            }
            Write-Host "+ Added JS to $page" -ForegroundColor Green
        }
        
        # Write back
        Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
        
    }
    else {
        Write-Host "X File not found: $page" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Done! TV Remote Navigation added to all pages." -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "- Total pages updated: $($pages.Count)" -ForegroundColor White
Write-Host "- CSS file: css/tv-remote-styles.css" -ForegroundColor White
Write-Host "- JS file: js/tv-remote-navigation.js" -ForegroundColor White
