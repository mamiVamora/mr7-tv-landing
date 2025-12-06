# PowerShell script to add env-loader to all HTML pages

$envLoaderScript = @"

    <!-- AI Chatbot -->
    <script src="bot/env-loader.js"></script>
    <script src="bot/chatbot.js"></script>
</body>
"@

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

foreach ($page in $pages) {
    $filePath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Replace old chatbot script with new one including env-loader
        $newContent = $content -replace '<!-- AI Chatbot -->\s*<script src="bot/chatbot.js"></script>\s*</body>', $envLoaderScript
        
        # Write back to file
        Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
        
        Write-Host "Updated $page with env-loader" -ForegroundColor Green
    }
    else {
        Write-Host "File not found: $page" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! env-loader added to all pages." -ForegroundColor Cyan
