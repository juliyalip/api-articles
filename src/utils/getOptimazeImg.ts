import sharp from "sharp";
import path from 'path'

export const getOptimizeImg = async (tempPath: string) => {
    try {
        const newPath = path.join(process.cwd(), "public", "countries", `${Date.now()}.webp`)
        await sharp(tempPath).resize({ width: 300, height: 250, fit: "cover" }).toFile(newPath)
        return newPath
    } catch (error) {
        console.log('error from optimaze img', error)
        throw new Error("Image optimization failed");
    }
}