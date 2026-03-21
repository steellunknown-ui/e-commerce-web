$path = "c:\E-commerce web\src\data\mockData.js"
$content = Get-Content $path

# 1. Inject Wooden Imports before categories definition
$targetLine = $content | Select-String "export const categories ="
if ($targetLine) {
    $index = $targetLine.LineNumber - 1
    $insertBlock = @(
        "import dryFruitsBox from '@/assets/products/Wooden products/dry_fruits_box.png';",
        "import octagonStool from '@/assets/products/Wooden products/octagon_stool.png';",
        "import servingTray from '@/assets/products/Wooden products/serving_tray.png';",
        "import woodenBrownChoppingBoard from '@/assets/products/Wooden products/wooden_Brown_chopping_Board.png';",
        "import resinChoppingBoards from '@/assets/products/Wooden products/resin_chopping_boards.png';",
        "import woddenAntiqueClock from '@/assets/products/Wooden products/wodden_antique_clock.png';",
        "import choppingTray from '@/assets/products/Wooden products/chopping_tray.png';",
        ""
    )
    $content = $content[0..($index-1)] + $insertBlock + $content[$index..($content.Length - 1)]
}

# 2. Append wp8 before the "// --- Marble Products ---" line
$targetLine2 = $content | Select-String "// --- Marble Products ---"
if ($targetLine2) {
    $index2 = $targetLine2.LineNumber - 1 # 0-indexed
    $wp8Block = @(
        "  {",
        "    id: 'wp8',",
        "    name: 'Wooden Chopping Tray',",
        "    slug: 'wooden-chopping-tray',",
        "    short_description: 'Standard dense fiber handle board maintaining absolute cooking speeds safely.',",
        "    full_description: 'Smooth polish finish layout continuous design preserving temperature frames.',",
        "    price: 999,",
        "    moq: '10 Piece',",
        "    material: 'Organic Teak Wood',",
        "    origin: 'Artisanal Studio',",
        "    shelf_life: 'Lifetime',",
        "    size_info: 'Size 30x20cm',",
        "    weight_info: '1.2 Kg',",
        "    benefits: 'Durable servers.',",
        "    care_instructions: 'Wipe with dry cloth.',",
        "    thumbnail_url: choppingTray,",
        "    is_featured: false,",
        "    is_active: true,",
        "    category_id: 'wooden-products',",
        "  },"
    )
    $content = $content[0..($index2-1)] + $wp8Block + $content[$index2..($content.Length - 1)]
}

# 3. Update variables wp1 -> wp6
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($content[$i] -match "id: 'wp1',") { for ($j=$i; $j -lt $i+25; $j++) { if ($content[$j] -match "thumbnail_url:") { $content[$j] = "    thumbnail_url: dryFruitsBox,"; break } } }
    if ($content[$i] -match "id: 'wp2',") { for ($j=$i; $j -lt $i+25; $j++) { if ($content[$j] -match "thumbnail_url:") { $content[$j] = "    thumbnail_url: octagonStool,"; break } } }
    if ($content[$i] -match "id: 'wp3',") { for ($j=$i; $j -lt $i+25; $j++) { if ($content[$j] -match "thumbnail_url:") { $content[$j] = "    thumbnail_url: servingTray,"; break } } }
    if ($content[$i] -match "id: 'wp4',") { for ($j=$i; $j -lt $i+25; $j++) { if ($content[$j] -match "thumbnail_url:") { $content[$j] = "    thumbnail_url: woodenBrownChoppingBoard,"; break } } }
    if ($content[$i] -match "id: 'wp5',") { for ($j=$i; $j -lt $i+25; $j++) { if ($content[$j] -match "thumbnail_url:") { $content[$j] = "    thumbnail_url: resinChoppingBoards,"; break } } }
    if ($content[$i] -match "id: 'wp6',") { for ($j=$i; $j -lt $i+25; $j++) { if ($content[$j] -match "thumbnail_url:") { $content[$j] = "    thumbnail_url: woddenAntiqueClock,"; break } } }
}

$content | Set-Content $path -Encoding utf8
Write-Host "Success"
