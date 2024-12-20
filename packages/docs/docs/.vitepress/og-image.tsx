import { Buffer } from 'node:buffer'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from '@vercel/og'
import React from 'react'

/* eslint-disable sonarjs/no-unknown-property, sonarjs/anchor-is-valid */

export function ogImage({ title, description }: { title: string, description: string }) {
  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-gray-900">
        <div tw="bg-gray-900 flex w-full">
          <div tw="flex flex-col w-full py-12 px-4 justify-between p-8">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10em" viewBox="0 0 1800.000000 710.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,710.000000) scale(0.100000,-0.100000)" stroke="none" style={{ fill: '#1e90ff' }}>
                <path d="M3498 7020 c-622 -66 -1103 -416 -1478 -1078 -29 -51 -54 -91 -56       -90 -2 2 6 208 16 458 11 250 20 481 20 513 l0 57 -970 0 -970 0 0 -3405 0       -3405 20 0 c12 0 25 10 32 25 l11 25 939 0 938 0 0 1823 c0 1114 4 1879 10       1970 46 673 292 1021 794 1123 39 8 145 17 236 20 542 19 840 -185 951 -653       55 -232 53 -134 56 -2291 l4 -1992 962 2 962 3 5 1955 c5 1778 7 1964 22 2052       59 338 154 542 324 697 164 150 417 231 724 231 571 0 848 -243 947 -830 16       -97 18 -249 20 -2107 l4 -2003 827 0 c455 0 833 4 841 9 9 6 -6 18 -55 41       -125 58 -157 75 -224 115 -165 99 -338 252 -465 411 -41 51 -75 96 -75 99 0 4       -9 20 -20 35 -59 83 -149 270 -193 400 -97 288 -130 513 -131 880 0 436 59       724 213 1030 121 241 297 437 548 613 29 20 56 37 59 37 3 0 74 33 157 74 218       106 462 187 697 230 343 63 603 76 1563 76 l697 0 0 33 c-1 66 -29 265 -50       357 -85 360 -271 583 -569 685 -264 90 -683 75 -1012 -35 -241 -80 -482 -233       -697 -441 -45 -45 -88 -79 -94 -77 -7 3 -48 47 -91 99 -103 123 -350 416 -505       599 -68 80 -139 159 -157 175 -18 17 -68 73 -111 125 -44 52 -109 130 -146       173 -38 42 -68 85 -68 95 0 9 67 85 150 167 82 82 150 155 150 161 0 21 -254       257 -345 323 -312 220 -627 342 -1035 397 -157 22 -532 25 -670 5 -558 -77       -1003 -303 -1420 -721 -105 -105 -278 -306 -343 -399 -9 -14 -18 -23 -20 -20       -3 2 -31 56 -63 119 -75 148 -211 350 -313 467 -264 300 -609 486 -1016 548       -123 19 -420 27 -537 15z" />
                <path d="M12700 6942 c0 -31 -2 -30 135 -84 112 -44 280 -134 397 -212 455       -303 774 -738 973 -1326 l32 -95 395 -5 396 -5 -319 -585 -319 -585 3 -1945 2       -1945 1688 -3 1687 -2 0 875 0 875 -1243 2 -1243 3 1355 2435 1355 2435 1 95       0 95 -2647 3 -2648 2 0 -28z" />
                <path d="M10958 2879 c-276 -40 -453 -189 -512 -430 -21 -85 -21 -265 -1 -344       35 -135 133 -259 258 -329 221 -124 586 -157 942 -85 458 92 735 353 800 752       9 57 15 160 15 270 l0 177 -722 -1 c-398 -1 -749 -5 -780 -10z" />
                <path d="M12410 926 c-224 -346 -462 -577 -755 -736 l-120 -65 450 -3 c248 -1       455 0 461 2 6 2 14 47 17 108 14 229 38 778 35 801 -2 20 -19 0 -88 -107z" />
              </g>
            </svg>
            <h2 tw="flex flex-col text-6xl font-bold tracking-tight text-gray-50 text-left mb-4 mt-8">
              {title}
            </h2>
            <p tw="text-3xl mt-0 text-gray-300">
              {description}
            </p>
            <div tw="mt-8 flex">
              <div tw="flex rounded-xl shadow">
                <a tw="flex items-center justify-center rounded-xl border border-transparent bg-blue-500 px-10 py-6 text-3xl font-semibold text-white">Get started</a>
              </div>
              <div tw="ml-3 flex rounded-xl shadow">
                <a tw="flex items-center justify-center rounded-xl border border-transparent bg-white px-10 py-6 text-3xl font-semibold text-blue-500">Learn more</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // emoji: 'twemoji'
    },
  )
}

export async function getOgImage({ outputFolder, filename, title, description }: { outputFolder: string, filename: string, title: string, description: string }) {
  try {
    const imageResponse = ogImage({ title, description })

    // create output folder
    await mkdir(outputFolder, { recursive: true })

    const imagePath = join(outputFolder, `${filename}.png`)

    // save image into public folder
    const imageBuffer = await imageResponse.arrayBuffer()
    const image = Buffer.from(imageBuffer)
    await writeFile(imagePath, image)

    return imagePath
  }
  catch (error) {
    console.error(`Error generating og image: ${error}`)
    throw error
  }
}
