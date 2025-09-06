'use client';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addProduct, State } from '@/lib/firebase/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Ajout en cours...' : 'Ajouter le produit'}
        </Button>
    )
}

export function AddProductDialog({ open, onOpenChange, onProductAdded }: AddProductDialogProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addProduct, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: state.message,
        });
      } else {
        toast({
            title: "Succès",
            description: state.message,
        });
        onProductAdded();
        onOpenChange(false);
        formRef.current?.reset();
      }
    }
  }, [state, toast, onOpenChange, onProductAdded]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
        </DialogHeader>
        <form action={dispatch} ref={formRef} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" name="name" className="col-span-3" required />
            {state.errors?.name && <p className="col-span-4 text-destructive text-xs text-right">{state.errors.name}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Prix (FCFA)
            </Label>
            <Input id="price" name="price" type="number" className="col-span-3" required />
             {state.errors?.price && <p className="col-span-4 text-destructive text-xs text-right">{state.errors.price}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" name="description" className="col-span-3" required />
             {state.errors?.description && <p className="col-span-4 text-destructive text-xs text-right">{state.errors.description}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Catégorie
            </Label>
            <Select name="category">
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="femmes">Femmes</SelectItem>
                    <SelectItem value="hommes">Hommes</SelectItem>
                    <SelectItem value="montres">Montres</SelectItem>
                    <SelectItem value="sacs">Sacs</SelectItem>
                </SelectContent>
            </Select>
            {state.errors?.category && <p className="col-span-4 text-destructive text-xs text-right">{state.errors.category}</p>}
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input id="image" name="image" type="file" className="col-span-3" required accept="image/*"/>
             {state.errors?.image && <p className="col-span-4 text-destructive text-xs text-right">{state.errors.image}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hint" className="text-right">
              Indice IA (Optionnel)
            </Label>
            <Input id="hint" name="hint" className="col-span-3" placeholder="ex: luxury watch" />
          </div>
           {state.errors?.server && <p className="col-span-4 text-destructive text-xs text-center">{state.errors.server}</p>}

          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Annuler</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
