import { Check, ImagePlus, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { BackgroundImageRecord } from "../../../shared/backgroundImageStore";

export type GalleryBackground = BackgroundImageRecord & {
  previewUrl: string;
};

type CustomBackgroundGalleryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: GalleryBackground[];
  activeId: string | null;
  opacity: number;
  blur: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: () => void;
  onOpacityChange: (value: number) => void;
  onBlurChange: (value: number) => void;
};

export default function CustomBackgroundGallery({
  open,
  onOpenChange,
  images,
  activeId,
  opacity,
  blur,
  onSelect,
  onDelete,
  onUpload,
  onOpacityChange,
  onBlurChange,
}: CustomBackgroundGalleryProps) {
  const activeImage = images.find((image) => image.id === activeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-[#00ffff] bg-[#101522] text-white shadow-[0_0_40px_rgba(0,255,255,0.25)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#00ffff]">
            <SlidersHorizontal className="h-5 w-5" />
            Background Gallery
          </DialogTitle>
          <DialogDescription className="text-[#7a7f8e]">
            Select a saved image, remove one you no longer need, or tune the active background appearance.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const isActive = image.id === activeId;
            return (
              <div
                key={image.id}
                className={`overflow-hidden rounded-xl border transition-all ${
                  isActive
                    ? "border-[#ff00ff] shadow-[0_0_18px_rgba(255,0,255,0.3)]"
                    : "border-[#2a2f3e] hover:border-[#00ffff]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(image.id)}
                  className="group block w-full text-left"
                  aria-label={`Use ${image.name} as the background`}
                >
                  <div className="relative aspect-video overflow-hidden bg-[#0b0e14]">
                    <img
                      src={image.previewUrl}
                      alt={image.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isActive && (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#ff00ff] px-2 py-1 text-xs font-semibold text-white">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-white">{image.name}</p>
                    <p className="text-xs text-[#7a7f8e]">{new Date(image.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
                <div className="flex items-center justify-between border-t border-[#2a2f3e] px-3 py-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-[#00eaff] hover:bg-[#00eaff]/10 hover:text-[#00eaff]"
                    onClick={() => onSelect(image.id)}
                  >
                    Use image
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-[#ff6b9d] hover:bg-[#ff6b9d]/10 hover:text-[#ff6b9d]"
                    onClick={() => onDelete(image.id)}
                    aria-label={`Delete ${image.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {images.length === 0 && (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-[#2a2f3e] p-6 text-center sm:col-span-2 lg:col-span-3">
              <ImagePlus className="mb-3 h-8 w-8 text-[#00eaff]" />
              <p className="font-medium text-white">Your gallery is empty</p>
              <p className="mt-1 text-sm text-[#7a7f8e]">Upload a custom image to save it across sessions.</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#2a2f3e] bg-[#0b0e14]/70 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[#00ffff]">Appearance controls</h3>
              <p className="text-xs text-[#7a7f8e]">
                {activeImage ? `Adjusting ${activeImage.name}` : "Select a saved image to adjust it."}
              </p>
            </div>
            <Button type="button" size="sm" className="btn-neon-cyan gap-2" onClick={onUpload}>
              <ImagePlus className="h-4 w-4" /> Upload image
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="background-opacity" className="text-[#00ffff]">Opacity</Label>
                <span className="text-xs text-[#7a7f8e]">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider
                id="background-opacity"
                value={[Math.round(opacity * 100)]}
                min={10}
                max={100}
                step={1}
                disabled={!activeImage}
                onValueChange={([value]) => onOpacityChange((value ?? 15) / 100)}
                aria-label="Custom background opacity"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="background-blur" className="text-[#00ffff]">Blur</Label>
                <span className="text-xs text-[#7a7f8e]">{blur}px</span>
              </div>
              <Slider
                id="background-blur"
                value={[blur]}
                min={0}
                max={16}
                step={1}
                disabled={!activeImage}
                onValueChange={([value]) => onBlurChange(value ?? 0)}
                aria-label="Custom background blur"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
