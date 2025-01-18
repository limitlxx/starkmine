'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, HelpCircle, CheckCircle2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { GoldNFTPreview } from "@/components/gold-nft-preview"
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  // Gold Bar Information
  weight: z.string().min(1, "Weight is required"),
  purity: z.string().min(1, "Purity is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  
  // Documents
  assayReport: z.any().optional(),
  certificateOfOrigin: z.any().optional(),
  lastPurchaseInvoice: z.any().optional(),
  billOfSale: z.any().optional(),
  shippingDoc: z.any().optional(),
  
  // Verification
  kycDocument: z.any().optional(),
  goldBarPhotos: z.any().optional(),
  
  // Vault Storage
  vaultName: z.string().min(1, "Vault name is required"),
  vaultLocation: z.string().min(1, "Vault location is required"),
  storageAgreement: z.any().optional(),
  vaultSecurityDetails: z.string().min(1, "Vault security details are required"),
  
  // Fractional Setup
  royaltyFee: z.string().min(1, "Royalty fee is required"),
  presumedPrice: z.string().optional(),
  costPerFraction: z.string().min(1, "Cost per fraction is required"),
  totalFractions: z.string().min(1, "Total fractions is required"),
})

export default function MintGold() {
  const [step, setStep] = useState(1)
  const totalSteps = 5
  const steps = ['Gold Details', 'Documents', 'Verification', 'Vault Storage', 'Fractional Setup']
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isInVault, setIsInVault] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "",
      purity: "",
      serialNumber: "",
      title: "",
      description: "",
      vaultName: "",
      vaultLocation: "",
      vaultSecurityDetails: "",
      royaltyFee: "2.5",
      presumedPrice: "",
      costPerFraction: "",
      totalFractions: "100",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Gold NFT minted successfully!",
        variant: "default",
      });
    }, 2000);
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    
    // Determine which fields to validate based on the current step
    switch (step) {
      case 1:
        fieldsToValidate = ['title', 'weight', 'purity', 'serialNumber', 'description'];
        break;
      case 2:
        fieldsToValidate = ['assayReport', 'certificateOfOrigin', 'lastPurchaseInvoice', 'billOfSale', 'shippingDoc'];
        break;
      case 3:
        fieldsToValidate = ['kycDocument', 'goldBarPhotos'];
        break;
      case 4:
        fieldsToValidate = ['vaultName', 'vaultLocation', 'storageAgreement', 'vaultSecurityDetails'];
        break;
      case 5:
        fieldsToValidate = ['totalFractions', 'costPerFraction', 'royaltyFee', 'presumedPrice'];
        break;
    }

    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid) {
      if (step < totalSteps) {
        setStep((prevStep) => prevStep + 1);
        // Simulate verification and vault storage processes
        if (step === 3) {
          setTimeout(() => setIsVerified(true), 1000);
        } else if (step === 4) {
          setTimeout(() => setIsInVault(true), 1000);
        }
      } else {
        setIsSubmitting(true);
        form.handleSubmit(onSubmit)();
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="mb-4 inline-flex items-center text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-white">Mint Gold NFT</h1>
          <p className="mt-2 text-zinc-400">
            Create a new fractional gold NFT by providing the required information and documents.
          </p>
        </div>

        <div className="mb-12">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-zinc-800" />
            <div 
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-orange-500 transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((label, index) => (
                <div key={label} className="flex flex-col items-center">
                  <div 
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                      index + 1 === step 
                        ? 'bg-orange-500 text-white'
                        : index + 1 < step
                        ? 'bg-orange-500 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {index + 1 < step ? '✓' : index + 1}
                  </div>
                  <span className={`mt-2 text-sm ${
                    index + 1 === step 
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

        <Card className="mx-auto max-w-2xl bg-zinc-900 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white">Gold Bar Information</h2>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1kg Gold Bar - Series A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (in grams)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="1000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="purity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purity (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="99.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter serial number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a detailed description of the gold bar"
                            className="h-32 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white">Required Documents</h2>
                  <p className="text-sm text-zinc-400">
                    Please upload all required documents in PDF format.
                  </p>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="assayReport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="flex items-center gap-2">
                              Assay Report
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-zinc-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Official document verifying the purity of the gold</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf"
                              onChange={(file) => field.onChange(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="certificateOfOrigin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate of Origin</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf"
                              onChange={(file) => field.onChange(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastPurchaseInvoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Purchase Invoice</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf"
                              onChange={(file) => field.onChange(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billOfSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bill of Sale</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf"
                              onChange={(file) => field.onChange(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingDoc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Documentation</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf"
                              onChange={(file) => field.onChange(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white">Verification</h2>
                  <p className="text-sm text-zinc-400">
                    Please provide the necessary documents for KYC verification and gold bar authentication.
                  </p>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="kycDocument"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>KYC Document</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf,.jpg,.png"
                              onChange={(file) => field.onChange(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="goldBarPhotos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gold Bar Photos</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".jpg,.png"
                              onChange={(file) => field.onChange(file)}
                               
                            />
                          </FormControl>
                          <FormDescription>
                            Please upload clear photos of the gold bar from multiple angles.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isVerified && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Verification successful</span>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white">Vault Storage</h2>
                  <p className="text-sm text-zinc-400">
                    Provide details about the secure storage of the gold bar.
                  </p>
                  <FormField
                    control={form.control}
                    name="vaultName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the name of the vault" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vaultLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the location of the vault" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storageAgreement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Agreement</FormLabel>
                        <FormControl>
                          <FileUpload
                            accept=".pdf"
                            onChange={(file) => field.onChange(file)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vaultSecurityDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault Security Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide details about the vault's security measures"
                            className="h-32 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isInVault && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Gold bar confirmed in vault</span>
                    </div>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white">Fractional Setup</h2>
                  <div className="rounded-lg bg-zinc-800/50 p-4">
                    <p className="text-sm text-zinc-400">
                      Configure how your gold NFT will be divided into fractions and set up the pricing structure.
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="totalFractions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Fractions</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Number of fractions to create
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="costPerFraction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost per Fraction (STRK)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="bg-zinc-800" />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="royaltyFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Royalty Fee (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Percentage fee on secondary sales
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="presumedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Presumed Price (STRK)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional: Set a suggested market price
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">NFT Preview</h3>
                    <div className="bg-zinc-800 p-4 rounded-lg flex justify-center">
                      <GoldNFTPreview
                        title={form.watch('title') || 'Gold NFT'}
                        weight={form.watch('weight') || '0'}
                        purity={form.watch('purity') || '0'}
                        serialNumber={form.watch('serialNumber') || 'N/A'} issueDate={""}                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 border-zinc-800 text-white hover:bg-zinc-800"
                  >
                    Previous
                  </Button>
                )}
                <Button 
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : (step === totalSteps ? 'Mint Gold NFT' : 'Next')}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

