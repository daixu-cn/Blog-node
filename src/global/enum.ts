/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: string
 *       enum: ['CODE', 'TUTORIAL', 'LEISURE', 'JOURNAL']
 *       description: |
 *         文章类别:
 *         - CODE
 *           实验室
 *         - 探索站
 *           生活日记
 *         - 咖啡屋
 *           休闲一刻
 *         - JOURNAL
 *           生活碎片
 */
export enum category {
  CODE = "实验室",
  TUTORIAL = "探索站",
  LEISURE = "咖啡屋",
  JOURNAL = "生活碎片"
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LemonMediaType:
 *       type: string
 *       enum: ['IMAGE', 'VIDEO']
 *       description: |
 *         文章类别:
 *         - IMAGE
 *           图片
 *         - VIDEO
 *           视频
 */
export enum lemon_media_type {
  IMAGE = "图片",
  VIDEO = "视频"
}
