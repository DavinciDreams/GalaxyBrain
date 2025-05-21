"use server"

import { put, list, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Generate a unique filename with original extension
    const extension = file.name.split(".").pop()
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    return {
      success: true,
      url: blob.url,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

export async function uploadVoiceRecording(formData: FormData) {
  try {
    const audioBlob = formData.get("audio") as Blob

    if (!audioBlob) {
      return { success: false, error: "No audio recording provided" }
    }

    // Generate a unique filename
    const uniqueFilename = `voice-recording-${Date.now()}.webm`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, audioBlob, {
      access: "public",
      contentType: "audio/webm",
    })

    return {
      success: true,
      url: blob.url,
      filename: uniqueFilename,
      contentType: "audio/webm",
      duration: formData.get("duration") || "unknown",
    }
  } catch (error) {
    console.error("Error uploading voice recording:", error)
    return { success: false, error: "Failed to upload voice recording" }
  }
}

export async function deleteFile(url: string) {
  try {
    await del(url)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: "Failed to delete file" }
  }
}

export async function listNoteAttachments(noteId: string) {
  try {
    // In a real app, you'd filter by note ID in the path prefix
    // This is a simplified example
    const { blobs } = await list({ prefix: `note-${noteId}/` })

    return {
      success: true,
      files: blobs.map((blob) => ({
        url: blob.url,
        filename: blob.pathname.split("/").pop() || "unknown",
        contentType: blob.contentType || "application/octet-stream",
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
    }
  } catch (error) {
    console.error("Error listing attachments:", error)
    return { success: false, error: "Failed to list attachments" }
  }
}
