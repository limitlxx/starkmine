import { Button } from "@/components/ui/button"
import { Upload, X } from 'lucide-react'
import { useState } from "react"

interface FileUploadProps {
  label?: string
  onChange: (file: File | null) => void
  accept?: string
  value?: File | null
}

export function FileUpload({ label, onChange, accept = ".pdf,.doc,.docx", value }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    onChange(selectedFile)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="file"
          className="hidden"
          accept={accept}
          id={label}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
        {!file ? (
          <label
            htmlFor={label}
            className="flex min-h-[2.5rem] w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Upload className="h-4 w-4" />
            Choose file
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm">
            <span className="truncate text-white">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2 h-5 w-5 rounded-full p-0 text-zinc-400 hover:text-white"
              onClick={() => handleFileChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

