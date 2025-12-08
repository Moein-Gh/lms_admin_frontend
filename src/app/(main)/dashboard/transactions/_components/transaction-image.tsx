import * as React from "react";
import { Image as ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/entities/transaction.type";

type TransactionImageProps = {
  readonly images: Transaction["images"];
  readonly transaction?: Pick<Transaction, "code" | "user">;
};

export function TransactionImage({ images, transaction }: TransactionImageProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [origin, setOrigin] = React.useState<string>("center center");

  const resetZoom = () => {
    setIsZoomed(false);
    setOrigin("center center");
  };

  const handleImageClick = (url: string) => {
    setSelected(url);
    setOpen(true);
    resetZoom();
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const filename = decodeURIComponent((url.split("/").pop() as string) || "file");
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // Fallback: open in new tab if programmatic download fails
      // This keeps previous behavior while improving most cases.

      console.error("Download failed, falling back to opening in new tab:", err);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (images.length === 0) {
    return null;
  }

  const userName =
    transaction?.user?.identity.name ?? (transaction?.user?.code ? `کاربر ${transaction.user.code}` : undefined);
  const txCode = transaction?.code ? `کد: ${transaction.code}` : undefined;

  return (
    <div className="col-span-2 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ImageIcon className="h-4 w-4" />
        <span>تصاویر ضمیمه ({images.length})</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {images.map((img) => (
          <Button
            key={img.id}
            variant="outline"
            size="sm"
            onClick={() => handleImageClick(img.file.url)}
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">نمایش</span>
          </Button>
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetZoom();
        }}
      >
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-background/95 backdrop-blur-sm border-none shadow-2xl sm:rounded-2xl">
          <div className="relative flex flex-col h-[85vh] md:h-[80vh]">
            <div className="absolute top-0 left-0 gap-6 z-50 flex flex-row items-center justify-between p-4 bg-linear-to-b from-black/60 to-transparent text-white">
              <div className="flex flex-col items-end gap-1">
                <div className="font-medium opacity-90 text-right">پیش‌نمایش تصویر</div>
                <div className="text-xs text-muted-foreground text-right">
                  {userName && <span className="block">{userName}</span>}
                  {txCode && <span className="block">{txCode}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selected)}
                    className="h-8 gap-2 rounded-full bg-black/20 hover:bg-black/40 text-white hover:text-white border-0"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">دانلود</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 w-full h-full bg-black/90 flex items-center justify-center overflow-hidden relative">
              {selected && (
                <div
                  className={cn(
                    "relative transition-transform duration-200 ease-out",
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                  )}
                  onClick={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    if (!isZoomed) {
                      const rect = el.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setOrigin(`${x}% ${y}%`);
                      setIsZoomed(true);
                    } else {
                      setIsZoomed(false);
                      setOrigin("center center");
                    }
                  }}
                  style={{
                    transform: isZoomed ? "scale(2.5)" : "scale(1)",
                    transformOrigin: origin
                  }}
                >
                  <Image
                    src={selected}
                    alt="تصویر بزرگ"
                    width={1200}
                    height={800}
                    className="max-h-[85vh] w-auto object-contain"
                    unoptimized
                  />
                </div>
              )}

              {/* Zoom Hint */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium pointer-events-none opacity-70">
                {isZoomed ? "برای کوچک‌نمایی کلیک کنید" : "برای بزرگ‌نمایی کلیک کنید"}
              </div>
            </div>
          </div>

          {/* Hidden accessible title/desc required by Radix Dialog */}
          <div className="sr-only">
            <DialogTitle>پیش‌نمایش تصویر</DialogTitle>
            <DialogDescription>نمایش تصویر ضمیمه تراکنش با قابلیت بزرگ‌نمایی</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
