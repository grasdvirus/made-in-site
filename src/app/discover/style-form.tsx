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
    message: 'Please describe your preferences in at least 10 characters.',
  }),
});

const browsingHistory = [
    'Classic Trench Coat',
    'Leather Ankle Boots',
    'Silk Scarf',
    'High-Waisted Skinny Jeans',
    'Cashmere Sweater',
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
      setError('Sorry, we couldn\'t generate recommendations at this time. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold mb-2">Recent Views</h4>
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
            <CardTitle>Describe Your Style</CardTitle>
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
                        What are you looking for? (e.g., "casual outfits for weekends", "a professional look for work", "bright summer colors")
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I love vintage styles and comfortable, natural fabrics like cotton and linen..."
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {recommendations && recommendations.recommendations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 font-headline">Our Suggestions for You</h3>
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
