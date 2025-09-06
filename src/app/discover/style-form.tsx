'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getPersonalizedStyleRecommendations,
  type PersonalizedStyleRecommendationsOutput,
} from '@/ai/flows/personalized-style-recommendations';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  preferences: z.string().min(10, {
    message: 'Veuillez décrire vos préférences en au moins 10 caractères.',
  }),
});

const browsingHistory = [
    'Trench-coat classique',
    'Bottines en cuir',
    'Foulard en soie',
    'Jean skinny taille haute',
    'Pull en cachemire',
];

export function StyleForm() {
  const [recommendations, setRecommendations] = useState<PersonalizedStyleRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await getPersonalizedStyleRecommendations({
        browsingHistory,
        preferences: values.preferences,
      });
      setRecommendations(result);
    } catch (e) {
      setError('Désolé, nous n\'avons pas pu générer de recommandations pour le moment. Veuillez réessayer.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Votre profil</CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold mb-2">Vus récemment</h4>
          <div className="flex flex-wrap gap-2">
            {browsingHistory.map((item) => (
              <Badge key={item} variant="secondary">{item}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Décrivez votre style</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Que recherchez-vous ? (par ex., "tenues décontractées pour le week-end", "un look professionnel pour le travail", "couleurs vives pour l'été")
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="J'adore les styles vintage et les tissus naturels et confortables comme le coton et le lin..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Obtenir des recommandations
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {recommendations && recommendations.recommendations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 font-headline">Nos suggestions pour vous</h3>
                <ul className="space-y-2">
                  {recommendations.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center p-3 bg-muted/50 rounded-md">
                       <Wand2 className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
             {error && <p className="mt-4 text-destructive">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
