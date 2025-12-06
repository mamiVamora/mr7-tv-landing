# PowerShell script to add chatbot to all HTML pages

$chatbotScript = @"

    <!-- AI Chatbot -->
    <script src="bot/chatbot.js"></script>
</body>
"@

$pages = @(
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
        
        # Check if chatbot is already added
        if ($content -notmatch "bot/chatbot.js") {
            # Replace </body> with chatbot script + </body>
            $newContent = $content -replace '</body>', $chatbotScript
            
            # Write back to file
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
            
            Write-Host "Added chatbot to $page" -ForegroundColor Green
        }
        else {
            Write-Host "Chatbot already exists in $page" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "File not found: $page" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Chatbot added to all pages." -ForegroundColor Cyan
