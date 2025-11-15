/**
 * 生成二维码展签PDF
 *
 * 使用方法：
 *   node scripts/generate-qr-codes-pdf.js
 *
 * 输出：
 *   qr-codes-labels.pdf (A4格式，8页，43个标签)
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// ===== 配置 =====
const CONFIG = {
  dataPath: path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json'),
  outputPath: path.join(__dirname, '../qr-codes-labels-new.pdf'),  // 使用新文件名避免文件被锁定
  baseUrl: 'https://vulcaart.art/exhibitions/negative-space-of-the-tide/',

  // 中文字体路径（Windows/macOS/Linux通用）
  // 注意：pdfkit 不支持 .ttc 格式，需要使用 .ttf 格式
  fonts: {
    // Windows: 黑体（SimHei）- .ttf 格式
    windowsPath: 'C:\\Windows\\Fonts\\simhei.ttf',
    // macOS: Heiti SC (黑体-简)
    macPath: '/System/Library/Fonts/STHeiti Medium.ttc',
    macPathAlt: '/Library/Fonts/Arial Unicode.ttf',
    // Linux: 文泉驿微米黑（如果已安装）
    linuxPath: '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc',
    linuxPathAlt: '/usr/share/fonts/truetype/arphic/uming.ttc'
  },

  // A4 页面尺寸（单位：点，1mm ≈ 2.83点）
  page: {
    width: 595.28,   // 210mm
    height: 841.89,  // 297mm
    margin: 28.35    // 10mm
  },

  // 标签布局（2列×3行=6个/页）
  label: {
    cols: 2,
    rows: 3,
    width: 269.29,   // 95mm
    height: 263.62,  // 93mm
    gap: 22.68       // 8mm
  }
};

// ===== 检测并获取中文字体路径 =====
function getChineseFontPath() {
  const platform = process.platform;
  let fontPath;

  if (platform === 'win32') {
    fontPath = CONFIG.fonts.windowsPath;
  } else if (platform === 'darwin') {
    fontPath = CONFIG.fonts.macPath;
  } else {
    fontPath = CONFIG.fonts.linuxPath;
  }

  // 检查字体文件是否存在
  if (fs.existsSync(fontPath)) {
    console.log(`✓ 找到中文字体: ${fontPath}`);
    return fontPath;
  } else {
    console.error(`❌ 未找到中文字体文件: ${fontPath}`);
    console.error('请安装中文字体或指定正确的字体路径');
    throw new Error('Chinese font not found');
  }
}

// ===== 读取展览数据 =====
function loadExhibitionData() {
  console.log('📖 读取展览数据...');
  const jsonData = fs.readFileSync(CONFIG.dataPath, 'utf8');
  const data = JSON.parse(jsonData);
  console.log(`✓ 加载了 ${data.artworks.length} 件作品`);
  return data.artworks;
}

// ===== 生成二维码（返回Data URL） =====
async function generateQRCodeDataURL(url) {
  try {
    const dataURL = await QRCode.toDataURL(url, {
      width: 280,
      margin: 1,
      color: {
        dark: '#333333',
        light: '#ffffff'
      }
    });
    return dataURL;
  } catch (error) {
    console.error(`❌ 生成二维码失败: ${url}`, error);
    throw error;
  }
}

// ===== 绘制单个标签 =====
async function drawLabel(doc, artwork, x, y, chineseFont) {
  const { width, height } = CONFIG.label;
  const url = `${CONFIG.baseUrl}?artwork=${artwork.id}`;

  // 1. 绘制边框
  doc.save()
     .rect(x, y, width, height)
     .lineWidth(0.5)
     .strokeColor('#dddddd')
     .stroke();

  // 2. 绘制顶部品牌色条（紫色渐变，简化为纯色）
  doc.rect(x, y, width, 8)
     .fillColor('#667eea')
     .fill();

  // 3. 绘制VULCA Logo（居中，距顶部20点）
  doc.fontSize(20)
     .fillColor('#667eea')
     .font('Helvetica-Bold')
     .text('VULCA', x, y + 20, {
       width: width,
       align: 'center'
     });

  // 4. 绘制作品信息（居中，距logo下方15点）
  const infoY = y + 55;

  // 中文标题（使用中文字体）
  doc.fontSize(14)
     .fillColor('#333333')
     .font(chineseFont)
     .text(artwork.titleZh || 'Untitled', x + 10, infoY, {
       width: width - 20,
       align: 'center',
       lineGap: 4
     });

  // 英文标题
  const titleHeight = doc.heightOfString(artwork.titleZh || 'Untitled', { width: width - 20 });
  doc.fontSize(11)
     .fillColor('#666666')
     .font('Helvetica-Oblique')
     .text(artwork.titleEn || 'Untitled', x + 10, infoY + titleHeight + 6, {
       width: width - 20,
       align: 'center',
       lineGap: 3
     });

  // 艺术家和年份（使用中文字体）
  const enTitleHeight = doc.heightOfString(artwork.titleEn || 'Untitled', { width: width - 20 });
  const metaY = infoY + titleHeight + enTitleHeight + 18;

  doc.fontSize(10)
     .fillColor('#555555')
     .font(chineseFont)
     .text(artwork.artist, x + 10, metaY, {
       width: width - 20,
       align: 'center'
     });

  const artistHeight = doc.heightOfString(artwork.artist, { width: width - 20 });
  const yearText = artwork.status === 'pending'
    ? `${artwork.year} · 待定`
    : `${artwork.year}`;

  doc.fontSize(10)
     .fillColor('#999999')
     .font(chineseFont)
     .text(yearText, x + 10, metaY + artistHeight + 4, {
       width: width - 20,
       align: 'center'
     });

  // 5. 生成并绘制二维码（底部居中，100×100点）
  const qrSize = 100;
  const qrX = x + (width - qrSize) / 2;
  const qrY = y + height - qrSize - 20;

  const qrDataURL = await generateQRCodeDataURL(url);
  doc.image(qrDataURL, qrX, qrY, {
    width: qrSize,
    height: qrSize
  });

  // 6. 如果是待定作品，绘制状态标签（右上角）
  if (artwork.status === 'pending') {
    const badgeX = x + width - 50;
    const badgeY = y + 15;

    doc.save()
       .roundedRect(badgeX, badgeY, 40, 16, 4)
       .fillColor('#ff9800')
       .fill();

    doc.fontSize(8)
       .fillColor('#ffffff')
       .font(chineseFont)
       .text('待定', badgeX, badgeY + 4, {
         width: 40,
         align: 'center'
       });

    doc.restore();
  }

  doc.restore();
}

// ===== 主函数 =====
async function generatePDF() {
  console.log('\n🎨 VULCA 二维码展签生成器');
  console.log('='.repeat(50));

  // 1. 获取中文字体
  const chineseFontPath = getChineseFontPath();

  // 2. 加载数据
  const artworks = loadExhibitionData();

  // 3. 创建PDF文档
  console.log('\n📄 创建PDF文档...');
  const doc = new PDFDocument({
    size: [CONFIG.page.width, CONFIG.page.height],
    margin: CONFIG.page.margin,
    info: {
      Title: 'VULCA Exhibition QR Code Labels',
      Author: 'VULCA Platform',
      Subject: 'Exhibition Labels for Negative Space of the Tide',
      Keywords: 'QR Code, Exhibition, VULCA, Art'
    }
  });

  // 注册中文字体
  doc.registerFont('ChineseFont', chineseFontPath);

  // 4. 输出流
  const writeStream = fs.createWriteStream(CONFIG.outputPath);
  doc.pipe(writeStream);

  // 5. 生成标签
  console.log('\n🏷️  生成标签...');
  const { cols, rows, width, height, gap } = CONFIG.label;
  const { margin } = CONFIG.page;

  let labelCount = 0;
  let pageCount = 0;

  for (const artwork of artworks) {
    // 计算当前标签在页面中的位置
    const pageIndex = Math.floor(labelCount / (cols * rows));
    const indexInPage = labelCount % (cols * rows);
    const col = indexInPage % cols;
    const row = Math.floor(indexInPage / cols);

    // 如果是新页面，添加页面
    if (indexInPage === 0 && labelCount > 0) {
      doc.addPage();
      pageCount++;
    }

    // 计算标签左上角坐标
    const x = margin + col * (width + gap);
    const y = margin + row * (height + gap);

    // 绘制标签（传递中文字体名称）
    await drawLabel(doc, artwork, x, y, 'ChineseFont');

    labelCount++;
    console.log(`  ✓ [${labelCount}/${artworks.length}] ${artwork.titleZh} (${artwork.id})`);
  }

  // 5. 完成PDF
  doc.end();

  // 6. 等待写入完成
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  console.log('\n' + '='.repeat(50));
  console.log(`✅ PDF生成成功！`);
  console.log(`📍 文件位置: ${CONFIG.outputPath}`);
  console.log(`📊 统计数据:`);
  console.log(`   - 总页数: ${pageCount + 1} 页A4`);
  console.log(`   - 总标签数: ${labelCount} 个`);
  console.log(`   - 布局: ${cols}列 × ${rows}行 = ${cols * rows}个/页`);
  console.log('\n🎉 可以直接打印或发送到打印店！');
}

// ===== 执行 =====
generatePDF().catch(error => {
  console.error('\n❌ 生成失败:', error);
  process.exit(1);
});
