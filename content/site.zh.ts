import type { SiteContent } from './types';

export const siteZh: SiteContent = {
  brand: {
    name: 'xfein',
    tagline: 'xfein · Game & Design Studio',
  },
  nav: {
    home: '首页',
    store: '商城',
  },
  hero: {
    eyebrow: 'xfein · Game & Design Studio',
    headlineLine1: '游戏充值 · 视觉设计',
    headlineGradient: '一站直达',
    sub: 'Roblox、Liên Quân、Free Fire、Play Together、LoL、Valorant、FIFA、Genshin 等热门游戏官方充值，加上 Logo / 横幅 / 缩略图等设计服务，全部在 xfein 一站搞定。',
    primaryCta: '进入商城',
    secondaryCta: '订单查询',
    badges: [
      '官方充值渠道',
      '分钟级到账',
      '设计师 1 对 1 服务',
    ],
    stats: [
      { value: '1万+', label: '订单完成' },
      { value: '99%', label: '准时交付' },
      { value: '4.9★', label: '客户评分' },
    ],
  },
  gameShowcase: {
    eyebrow: 'GAME TOP-UP',
    heading: '热门游戏官方充值',
    sub: '7 大主流游戏，全部走官方授权渠道，价格透明，售后可追溯。',
    seeAll: '查看全部游戏',
  },
  designServices: {
    eyebrow: 'DESIGN SERVICES',
    heading: '专业视觉设计',
    sub: '高级设计师 1 对 1 服务，从 Logo 到横幅、缩略图、YouTube 主页一应俱全。',
    items: [
      {
        key: 'logo',
        title: 'Logo 设计',
        desc: '品牌定制 Logo，含 AI/SVG 源文件与 2 轮修改。',
        fromPrice: 690000,
        currency: '₫',
        cta: '从此起',
      },
      {
        key: 'shop-banner',
        title: '店铺横幅',
        desc: 'Shopee / TikTok Shop / Lazada 适配的店铺主图。',
        fromPrice: 290000,
        currency: '₫',
        cta: '从此起',
      },
      {
        key: 'thumbnail',
        title: '视频缩略图',
        desc: 'YouTube / TikTok 高点击率封面，移动端最佳化。',
        fromPrice: 99000,
        currency: '₫',
        cta: '从此起',
      },
      {
        key: 'display-banner',
        title: '展示横幅',
        desc: 'Google / Meta 广告横幅与落地页主视觉。',
        fromPrice: 199000,
        currency: '₫',
        cta: '从此起',
      },
      {
        key: 'youtube-banner',
        title: 'YouTube 主页',
        desc: 'Channel Art + 头像 + 水印一整套品牌组合。',
        fromPrice: 249000,
        currency: '₫',
        cta: '从此起',
      },
      {
        key: 'icons',
        title: '图标集',
        desc: '品牌定制图标集，SVG/PNG 双导出，明暗双版本。',
        fromPrice: 390000,
        currency: '₫',
        cta: '从此起',
      },
    ],
    seeAll: '查看全部设计服务',
  },
  showcase: {
    eyebrow: 'EXPLORE',
    heading: '在左侧选择，右侧实时切换',
    sub: '7 大游戏 + 6 类设计服务，全部在一个面板内浏览，支持键盘 ← → 切换。',
    gamesLabel: '游戏充值',
    designLabel: '设计服务',
    autoplayPlay: '继续自动播放',
    autoplayPause: '暂停自动播放',
    prevLabel: '上一项',
    nextLabel: '下一项',
    highlightsLabel: '亮点',
    seeAll: '前往完整商城',
  },
  serviceCommitment: {
    eyebrow: 'SERVICE COMMITMENT',
    heading: '我们的服务承诺',
    sub: '清晰的开通路径、透明的订单状态、可追踪的售后链路。',
    items: [
      {
        icon: 'shield-check',
        title: '官方授权渠道',
        desc: '所有游戏充值均通过 Garena、HoYoverse 等官方授权渠道，账号安全可靠。',
      },
      {
        icon: 'activity',
        title: '订单实时透明',
        desc: '从下单到到账每一步都可追踪，进度透明，遇到问题秒级响应。',
      },
      {
        icon: 'headphones',
        title: '专属设计师',
        desc: '设计订单 1 对 1 对接，2 轮免费修改，源文件 100% 交付。',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'HOW IT WORKS',
    heading: '三步搞定一切',
    sub: '从充值到设计，整个流程在线完成，全程可追溯。',
    steps: [
      {
        num: '01',
        title: '选择服务',
        desc: '在商城浏览所有游戏与设计套餐，挑选最适合你的方案。',
      },
      {
        num: '02',
        title: '完成支付',
        desc: '支持 Momo、ZaloPay、银行卡、Apple Pay、信用卡等多种方式。',
      },
      {
        num: '03',
        title: '到账 / 交付',
        desc: '游戏充值通常分钟级到账，设计稿件按套餐时间内交付。',
      },
    ],
  },
  featured: {
    eyebrow: 'POPULAR',
    heading: '热门套餐',
    sub: '玩家与品牌方最常下单的方案，长期稳定有保障。',
    seeAll: '前往完整商城',
  },
  faq: {
    eyebrow: 'FAQ',
    heading: '常见问题',
    sub: '关于充值与设计服务的常见问答。',
    items: [
      {
        q: '游戏充值多久到账？',
        a: '主流游戏 1–10 分钟内到账，部分活动包最长不超过 24 小时。',
      },
      {
        q: '需要提供游戏密码吗？',
        a: '不需要。我们仅需要你的玩家 ID 或角色名，全程不接触你的密码。',
      },
      {
        q: '设计服务交付时间多久？',
        a: '缩略图与横幅最快当日交付，Logo 与图标集 3–5 天，复杂项目可定制时间表。',
      },
      {
        q: '支持哪些支付方式？',
        a: '支持 Momo、ZaloPay、VNPAY、Apple Pay、银联卡及主流国际信用卡。',
      },
      {
        q: '没收到充值或对设计稿不满意怎么办？',
        a: '充值未到账可全额退款；设计稿件包含 2 轮免费修改，仍不满意可申请按比例退款。',
      },
      {
        q: '可以发票吗？',
        a: '可以。所有订单都可以申请增值税发票，发票将在订单完成后 24 小时内开具。',
      },
    ],
  },
  ctaBanner: {
    heading: '准备好开始了吗？',
    sub: '游戏充值秒到账，设计交付有保障。xfein 让一切更简单。',
    cta: '进入商城',
  },
  footer: {
    tagline: '游戏充值 + 视觉设计，一站式解决方案。',
    columns: [
      {
        title: '产品',
        links: [
          { label: '商城', href: '/store' },
          { label: '游戏充值', href: '/store?cat=games' },
          { label: '设计服务', href: '/store?cat=design' },
        ],
      },
      {
        title: '支持',
        links: [
          { label: '帮助中心', href: '/help' },
          { label: '联系我们', href: '/contact' },
          { label: '订单查询', href: '/orders' },
        ],
      },
      {
        title: '法律',
        links: [
          { label: '服务条款', href: '/terms' },
          { label: '隐私政策', href: '/privacy' },
          { label: '退款政策', href: '/refund' },
        ],
      },
    ],
    copyright: '© 2026 xfein. All rights reserved.',
  },
  store: {
    badgeNew: '新品',
    badgePopular: '热销',
    badgeSale: '优惠',
    fromPrefix: '起价',
    perOrder: '/ 单',
    primaryCta: '立即购买',
    detailsCta: '查看详情',
    bannerEyebrow: 'xfein STORE',
    bannerHeading: '游戏 + 设计，一站直达',
    bannerSub: '7 大热门游戏官方充值，加上 6 类专业视觉设计服务，全部在这里。',
    categoryAll: '全部',
    categoryGames: '游戏充值',
    categoryDesign: '设计服务',
    sortLabel: '排序',
    sortNewest: '最新',
    sortPopular: '最热',
    sortPriceAsc: '价格 ↑',
    sortPriceDesc: '价格 ↓',
  },
};
