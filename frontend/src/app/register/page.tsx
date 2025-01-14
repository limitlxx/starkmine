'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import type { RegistrationForm } from "@/types/registration"
import { Header } from "@/components/header"
import Link from "next/link"

export default function RegisterMiner() {
    const [step, setStep] = useState(1)
    const steps = ['User Details', 'Business Info', 'Additional Docs', 'Complete']

    const [form, setForm] = useState<RegistrationForm>({
        legalName: '',
        dateOfBirth: '',
        address: '',
        governmentId: null,
        proofOfAddress: null,
        certificateOfIncorporation: null,
        memorandumArticles: null,
        taxId: '',
        businessLicense: null,
        sourceOfFunds: null,
        bankStatements: null,
        proofOfGoldSource: null,
    })

    const updateForm = (key: keyof RegistrationForm, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h1 className="mb-6 text-xl font-bold text-zinc-900">Beneficial Owner Information</h1>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-600">Legal Name</label>
                                <Input
                                    type="text"
                                    value={form.legalName}
                                    onChange={(e) => updateForm('legalName', e.target.value)}
                                    placeholder="Enter your legal name"
                                //   className="bg-zinc-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-600">Date of Birth</label>
                                <Input
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                                //   className="bg-zinc-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-600">Address</label>
                                <Input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => updateForm('address', e.target.value)}
                                    placeholder="Enter your address"
                                //   className="bg-zinc-100"
                                />
                            </div>
                        </div>
                    </>
                )
            case 2:
                return (
                    <>
                        <h1 className="mb-6 text-xl font-bold text-zinc-900">Business Information</h1>
                        <div className="space-y-6">
                            <FileUpload
                                label="Government Issued ID"
                                onChange={(file) => updateForm('governmentId', file)}
                            />
                            <FileUpload
                                label="Proof of Address"
                                onChange={(file) => updateForm('proofOfAddress', file)}
                            />
                            <FileUpload
                                label="Certificate of Incorporation"
                                onChange={(file) => updateForm('certificateOfIncorporation', file)}
                            />
                            <FileUpload
                                label="Memorandum and Articles of Association"
                                onChange={(file) => updateForm('memorandumArticles', file)}
                            />
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-600">Tax Identification Number (TIN)</label>
                                <Input
                                    type="text"
                                    value={form.taxId}
                                    onChange={(e) => updateForm('taxId', e.target.value)}
                                    placeholder="Enter your TIN"
                                //   className="bg-zinc-100"
                                />
                            </div>
                            <FileUpload
                                label="Business License"
                                onChange={(file) => updateForm('businessLicense', file)}
                            />
                        </div>
                    </>
                )
            case 3:
                return (
                    <>
                        <h1 className="mb-6 text-xl font-bold text-zinc-900">Additional Documents</h1>
                        <div className="space-y-6">
                            <FileUpload
                                label="Source of Funds"
                                onChange={(file) => updateForm('sourceOfFunds', file)}
                            />
                            <FileUpload
                                label="Bank Statements"
                                onChange={(file) => updateForm('bankStatements', file)}
                            />
                            <FileUpload
                                label="Proof of Gold Source"
                                onChange={(file) => updateForm('proofOfGoldSource', file)}
                            />
                        </div>
                    </>
                )
            case 4:
                return (
                    <div className="text-center">
                        <div className="mb-4 text-5xl">🎉</div>
                        <h1 className="mb-2 text-xl font-bold text-zinc-900">Registration Complete!</h1>
                        <p className="text-zinc-600">
                            Thank you for registering. We will review your information and get back to you shortly.
                        </p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to home
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Dealer's KYC</h1>
                    <p className="mt-2 text-zinc-400">
                        To start creating fractional gold NFT begin by providing the required information and documents.
                    </p>
                </div>
                {/* Stepper */}
                <div className="mb-12">
                    <div className="relative mx-auto max-w-3xl">
                        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-zinc-800" />
                        <div
                            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-orange-500 transition-all duration-300"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        />
                        <div className="relative flex justify-between">
                            {steps.map((label, index) => (
                                <div key={label} className="flex flex-col items-center">
                                    <div
                                        className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${index + 1 === step
                                                ? 'bg-orange-500 text-white'
                                                : index + 1 < step
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        {index + 1 < step ? '✓' : index + 1}
                                    </div>
                                    <span className={`mt-2 text-sm ${index + 1 === step
                                            ? 'text-orange-500'
                                            : 'text-zinc-400'
                                        }`}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card className="mx-auto max-w-xl bg-zinc-900 p-6">
                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (step < steps.length) {
                                setStep(step + 1)
                            }
                        }}
                    >
                        {renderStepContent()}
                        <div className="flex gap-4">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 border-zinc-200 hover:bg-zinc-100"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                type="submit"
                                className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                            >
                                {step === steps.length ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Telegram Section */}
                <div className="mt-20 text-center">
                    <div className="mx-auto mb-6 h-16 w-16 overflow-hidden rounded-full bg-gradient-to-b from-blue-500 to-blue-600">
                        <Image
                            src="/placeholder.svg"
                            alt="Telegram Logo"
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-orange-500">
                        Start trading on Telegram
                    </h2>
                    <p className="mb-6 text-zinc-400">
                        Use argent telegram for a seamless experience
                    </p>
                    <Button
                        variant="outline"
                        className="border-zinc-800 bg-transparent text-white hover:bg-zinc-800"
                    >
                        Launch in Telegram
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    )
}

