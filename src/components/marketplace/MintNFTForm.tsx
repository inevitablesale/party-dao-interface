
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from '@/hooks/useWalletProvider';
import { ethers } from 'ethers';

const mintNFTFormSchema = z.object({
  name: z.string().min(2, {
    message: "NFT name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageURI: z.string().url({
    message: "Image URI must be a valid URL.",
  }),
})

export interface MintNFTFormProps {
  wallet: any;
  durationType?: 'short-term' | 'long-term' | '';
}

// Contract addresses will be environment variables in production
const CONTRACT_ADDRESS = "0x123..."; // Placeholder address
const CONTRACT_ABI = ["function safeMint(address to, string name, string description, string imageURI)"];

export const MintNFTForm: React.FC<MintNFTFormProps> = ({ wallet, durationType }) => {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { getProvider, validateNetwork } = useWalletProvider();

  const form = useForm<z.infer<typeof mintNFTFormSchema>>({
    resolver: zodResolver(mintNFTFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageURI: "",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    try {
      const provider = await getProvider();
      await validateNetwork(provider);

      if (!form.formState.isValid) {
        toast({
          title: "Error",
          description: "Please fill out all fields correctly.",
          variant: "destructive",
        });
        return;
      }

      setIsMinting(true);

      const formValues = form.getValues();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider.provider.getSigner()
      );

      const tx = await contract.safeMint(
        wallet.address,
        formValues.name,
        formValues.description,
        formValues.imageURI
      );

      await tx.wait();

      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });

    } catch (error: any) {
      console.error("Minting error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle>Mint NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome NFT" className="bg-black/50 border-white/10 text-white" {...field} />
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
                    <Input placeholder="A unique NFT..." className="bg-black/50 border-white/10 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageURI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URI</FormLabel>
                  <FormControl>
                    <Input placeholder="ipfs://..." className="bg-black/50 border-white/10 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isMinting}>
              {isMinting ? (
                <>
                  Minting...
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" />
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
