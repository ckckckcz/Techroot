"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AVATAR_OPTIONS } from "@/constants/profile"
import { useImageUpload } from "@/hooks/useImageUpload"
import { PhotoUploadSection } from "./PhotoUploadSection"
import { AvatarSelectionGrid } from "./AvatarSelectionGrid"
import { ProfileInputFields } from "./ProfileInputFields"
import type { EditProfileFormProps, ProfileFormData, User } from "@/types"

export const EditProfileForm = ({ user, onUpdateSuccess, onClose, isMobile = false }: EditProfileFormProps) => {
    const [formData, setFormData] = useState<ProfileFormData>({
        name: user.name,
        institution: user.institution || "",
        avatar: user.avatar || AVATAR_OPTIONS[0],
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const {
        uploadedImage,
        isUploading,
        fileInputRef,
        handleImageUpload,
        removeUploadedImage,
        triggerFileInput,
    } = useImageUpload()

    const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAvatarSelect = (avatar: string) => {
        setFormData(prev => ({ ...prev, avatar }))
    }

    const handleRemoveImage = () => {
        removeUploadedImage()
        setFormData(prev => ({ ...prev, avatar: AVATAR_OPTIONS[0] }))
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const base64 = await handleImageUpload(e)
        if (base64) {
            setFormData(prev => ({ ...prev, avatar: base64 }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await api<{ success: boolean; message: string; data: { user: User } }>(
                "/api/auth/update",
                { method: "PUT", body: formData }
            )

            if (response.success) {
                onUpdateSuccess(response.data.user)
                toast({
                    title: "Berhasil!",
                    description: "Profil Anda telah diperbarui.",
                })
                onClose()
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: response.message || "Gagal memperbarui profil.",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Kesalahan",
                description: "Terjadi kesalahan sistem.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Mobile layout with scrollable content and fixed button
    if (isMobile) {
        return (
            <>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-6">
                        <PhotoUploadSection
                            userName={formData.name}
                            currentAvatar={formData.avatar}
                            uploadedImage={uploadedImage}
                            isUploading={isUploading}
                            onUploadClick={triggerFileInput}
                            onRemoveClick={handleRemoveImage}
                        />

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <AvatarSelectionGrid
                            avatarOptions={AVATAR_OPTIONS}
                            selectedAvatar={formData.avatar}
                            onSelectAvatar={handleAvatarSelect}
                            isVisible={!uploadedImage}
                        />

                        <ProfileInputFields
                            formData={formData}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>

                {/* Fixed Submit Button */}
                <div className="flex-shrink-0 border-t border-slate-100 p-4 bg-white">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isUploading}
                        className="w-full h-14 rounded-2xl bg-[#2443B0] hover:bg-[#1a36a9] text-white font-black shadow-xl shadow-[#2443B0]/20 transition-all gap-3"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Check className="h-5 w-5" />
                        )}
                        Simpan Perubahan
                    </Button>
                </div>
            </>
        )
    }

    // Desktop layout (original)
    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <PhotoUploadSection
                userName={formData.name}
                currentAvatar={formData.avatar}
                uploadedImage={uploadedImage}
                isUploading={isUploading}
                onUploadClick={triggerFileInput}
                onRemoveClick={handleRemoveImage}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            <AvatarSelectionGrid
                avatarOptions={AVATAR_OPTIONS}
                selectedAvatar={formData.avatar}
                onSelectAvatar={handleAvatarSelect}
                isVisible={!uploadedImage}
            />

            <ProfileInputFields
                formData={formData}
                onChange={handleFieldChange}
            />

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full h-14 rounded-2xl bg-[#2443B0] hover:bg-[#1a36a9] text-white font-black shadow-xl shadow-[#2443B0]/20 transition-all gap-3"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Check className="h-5 w-5" />
                    )}
                    Simpan Perubahan
                </Button>
            </div>
        </form>
    )
}
