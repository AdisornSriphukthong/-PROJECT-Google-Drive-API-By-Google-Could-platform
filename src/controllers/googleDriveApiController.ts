import { Router, Request, Response } from "express";
import { google } from "googleapis";
import * as fs from 'fs'

const uploadFileToGoogleDrive = async (req: Request, res: Response) => {
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const redirectURL = process.env.REDIRECT_URL
    const refreshToken = process.env.REFRESH_TOKEN

    //File, File Name
    const data = req.body

    try {
        const filePath = './src/uploads/' + data.fileName;
        const filePathList = data.fileName.split('.')
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURL);
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({
            version: "v3",
            auth: oauth2Client,
        });

        const folderId = "1GtD-K29mwFEUyc7xh6W50JsgsrjTCJB2";

        const response = await drive.files.create({
            requestBody: {
                name: filePathList[0], // Change file name if needed
                mimeType: "image/" + filePathList[1],
                parents: [folderId]
            },
            media: {
                mimeType: "image/" + filePathList[1],
                body: fs.createReadStream(filePath),
            },
        });

        if (response) {
            res.json({
                message: '✅ Upload Successful'
            })

            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log(error)
                }
            })
        }
    } catch (error: any) {
        res.json({
            errorMessage: 'Missing file or file name'
        })
    }
}

const getUrlImageFromGoogleDrive = async (req: Request, res: Response) => {
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const redirectURL = process.env.REDIRECT_URL
    const refreshToken = process.env.REFRESH_TOKEN
    const data = req.body

    const userIdList: string[] = data.userIdList

    try {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURL);
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({
            version: "v3",
            auth: oauth2Client,
        });

        const folderId = process.env.FOLDER_GOOGLE_DRIVE_ID;

 
        const urlImageList: any = []
        const promises: Promise<void>[] = []

        userIdList.forEach((element: string) => {
            const request = drive.files.list({
                q: `name='${element}' and mimeType contains 'image/' and '${folderId}' in parents`,
                fields: "files(id, name, webViewLink, webContentLink)",
                spaces: "drive",
            }).then(e => {
                if (!e.data.files || e.data.files.length === 0) {
                    console.log("No image found with that name.");
                    return;
                }
                
                const url: any = e.data.files[0].webViewLink?.split('/')
                urlImageList.push({
                    [element]: `https://drive.usercontent.google.com/download?id=${url[5]}&authuser=0`
                })
            })

            promises.push(request)
        })

        Promise.all(promises).then(() => {
            res.json({
                urlImageList: urlImageList
            }) // This will now contain all the URLs
            return {
                urlImageList: urlImageList
            }
        });

    } catch (error) {
        res.send(error)
        console.log('sdasd')
    }
}

export default {
    uploadFileToGoogleDrive,
    getUrlImageFromGoogleDrive
}
