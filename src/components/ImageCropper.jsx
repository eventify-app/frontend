import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CropIcon, Trash2Icon } from "lucide-react";
import { userService } from "../api/services/userService";

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  onCropComplete,
}) {
  const aspect = 1;
  const imgRef = useRef(null);

  const [crop, setCrop] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState("");

  // Ajusta crop al cargar la imagen
  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  // Calcula el preview recortado
  function onCropCompleteInternal(c) {
    if (imgRef.current && c.width && c.height) {
      const croppedUrl = getCroppedImg(imgRef.current, c);
      setCroppedImageUrl(croppedUrl);
    }
  }

  function getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return canvas.toDataURL("image/png");
  }

  // SUBIR la imagen recortada
  async function onCrop() {
  let finalCroppedImage = croppedImageUrl;

  if (!finalCroppedImage && imgRef.current && crop?.width && crop?.height) {
    finalCroppedImage = getCroppedImg(imgRef.current, crop);
  }

  setDialogOpen(false);

  if (finalCroppedImage) {
    const blob = await (await fetch(finalCroppedImage)).blob();
    const file = new File([blob], "avatar.png", { type: "image/png" });

    try {
      // ⬅️ Ahora devuelve URL completa automática
      const res = await userService.uploadProfilePhoto(file);

      console.log("Avatar actualizado:", res);

      // Guarda la URL completa en localStorage
      localStorage.setItem("profile_photo", res.full_url);

      // Envía la URL al ProfilePage
      if (onCropComplete) onCropComplete(res.full_url);

    } catch (err) {
      console.error("Error subiendo avatar:", err);
      alert("No se pudo subir la imagen.");
    }
  }

  setSelectedFile(null);
}


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="p-0">
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropCompleteInternal(c)}
            aspect={aspect}
            className="w-full"
          >
            <img
              ref={imgRef}
              src={selectedFile?.preview}
              alt="Cropper"
              onLoad={onImageLoad}
              className="w-full h-full object-contain"
            />
          </ReactCrop>
        </div>

        <DialogFooter className="p-6 pt-0 justify-center">
          <DialogClose asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedFile(null)}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button size="sm" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper para centrar crop
export function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
