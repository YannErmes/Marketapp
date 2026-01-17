import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DishCard {
  country: string;
  flagImage: string;
  dish: string;
  dishImage: string;
  description: string;
  history: string;
  whereToFind: string;
}

const dishes: DishCard[] = [
  { country: "Benin", flagImage: "/placeholder.svg", dish: "Akassa (Ogui)", dishImage: "/placeholder.svg", description: "A fermented corn-based dish deeply rooted in Beninese traditions, often shared during family meals.", history: "Akassa is popular because it's affordable, nourishing, and symbolizes simplicity and togetherness.", whereToFind: "Found throughout Benin, especially in local markets in Cotonou and Porto-Novo." },
  { country: "Congo", flagImage: "/placeholder.svg", dish: "Poulet Moambe", dishImage: "/placeholder.svg", description: "A rich chicken stew made with palm nut sauce, considered a national treasure.", history: "Its popularity comes from its deep flavors and role in celebrations, reflecting Congolese hospitality.", whereToFind: "Best experienced in Brazzaville at traditional restaurants and family celebrations." },
  { country: "Togo", flagImage: "/placeholder.svg", dish: "Fufu with Sauce Graine", dishImage: "/placeholder.svg", description: "A staple eaten daily, featuring pounded cassava with rich palm nut sauce.", history: "Fufu's importance lies in its communal eating style—meals are moments of unity.", whereToFind: "Available throughout Togo, especially in Lomé's local eateries." },
  { country: "Mali", flagImage: "/placeholder.svg", dish: "Tô with Okra Sauce", dishImage: "/placeholder.svg", description: "A millet-based dish served with flavorful okra or peanut sauce.", history: "Reflects Mali's agrarian roots and resilience in rural communities.", whereToFind: "Found in every corner of Mali, from Bamako to village homes." },
  { country: "Madagascar", flagImage: "/placeholder.svg", dish: "Romazava", dishImage: "/placeholder.svg", description: "A traditional meat and leafy greens stew with medicinal qualities.", history: "Represents harmony between food and nature in Malagasy culture.", whereToFind: "Served throughout Madagascar, especially in Antananarivo." },
  { country: "Burkina Faso", flagImage: "/placeholder.svg", dish: "Riz Gras", dishImage: "/placeholder.svg", description: "A festive rice dish cooked with meat and rich seasonings.", history: "Popular because it's festive yet accessible, symbolizing generosity.", whereToFind: "Common at celebrations in Ouagadougou and Bobo-Dioulasso." },
  { country: "Comoros", flagImage: "/placeholder.svg", dish: "Langouste à la Vanille", dishImage: "/placeholder.svg", description: "Fresh lobster prepared with world-famous vanilla.", history: "Showcases the islands' abundant seafood and unique identity.", whereToFind: "Best enjoyed on Grande Comore at coastal restaurants." },
  { country: "Djibouti", flagImage: "/placeholder.svg", dish: "Skoudehkaris", dishImage: "/placeholder.svg", description: "A fragrant rice dish with meat and aromatic spices.", history: "Reflects Djibouti's crossroads position between cultures.", whereToFind: "Found in Djibouti City's traditional eateries." },
  { country: "Mauritania", flagImage: "/placeholder.svg", dish: "Thieboudienne", dishImage: "/placeholder.svg", description: "Mauritania's version of the iconic rice and fish dish.", history: "Highlights the importance of rice and fish along the coast.", whereToFind: "Best in Nouakchott's coastal areas." },
  { country: "Ivory Coast", flagImage: "/placeholder.svg", dish: "Attiéké with Grilled Fish", dishImage: "/placeholder.svg", description: "Fermented cassava couscous with perfectly grilled fish.", history: "A street-food favorite and symbol of Ivorian culinary pride.", whereToFind: "Found throughout Abidjan, especially in Treichville." },
  { country: "Liberia", flagImage: "/placeholder.svg", dish: "Palava Sauce", dishImage: "/placeholder.svg", description: "A rich leafy green stew with meat or fish.", history: "Represents comfort food and Liberian home cooking creativity.", whereToFind: "Best in Monrovia's local restaurants." },
  { country: "Senegal", flagImage: "/placeholder.svg", dish: "Thieboudienne", dishImage: "/placeholder.svg", description: "Africa's most famous dish with rice, fish, and vegetables.", history: "Reflects Senegalese values of sharing and craftsmanship.", whereToFind: "Found everywhere in Senegal, best in Dakar." },
  { country: "Niger", flagImage: "/placeholder.svg", dish: "Dambou", dishImage: "/placeholder.svg", description: "Steamed grains with leafy vegetables.", history: "Reflects adaptation and survival in a harsh environment.", whereToFind: "Available throughout Niger, especially in Niamey." },
  { country: "Nigeria", flagImage: "/placeholder.svg", dish: "Jollof Rice", dishImage: "/placeholder.svg", description: "Vibrant tomato-based rice, a party staple.", history: "Famous for its flavor and cultural pride.", whereToFind: "Found at every celebration in Nigeria." },
  { country: "Morocco", flagImage: "/placeholder.svg", dish: "Couscous", dishImage: "/placeholder.svg", description: "Steamed semolina with vegetables and aromatic spices.", history: "Represents hospitality and centuries of culinary refinement.", whereToFind: "Best in Marrakech and Fes at traditional riads." }
];

const CultureSection = () => {
  const [selectedDish, setSelectedDish] = useState<DishCard | null>(null);
  const { t } = useTranslation();

  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('culture.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('culture.subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {dishes.map((dish, index) => (
              <Card key={index} className="overflow-hidden hover-lift transition-all duration-300 cursor-pointer border-2" onClick={() => setSelectedDish(dish)}>
                <div className="relative h-32 md:h-48 overflow-hidden bg-muted">
                  <img src={dish.dishImage} alt={dish.dish} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 md:border-4 border-primary shadow-lg bg-background">
                    <img src={dish.flagImage} alt={`${dish.country} flag`} className="w-full h-full object-cover" />
                  </div>
                </div>
                <CardContent className="p-2 md:p-4 text-center">
                  <h3 className="font-semibold text-sm md:text-lg mb-1">{dish.dish}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{dish.country}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDish && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-muted shrink-0">
                    <img src={selectedDish.flagImage} alt={`${selectedDish.country} flag`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedDish.dish}</DialogTitle>
                    <DialogDescription className="text-base">{selectedDish.country}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img src={selectedDish.dishImage} alt={selectedDish.dish} className="w-full h-64 object-cover" />
                </div>
                <div><h3 className="font-semibold text-lg mb-2">{t('culture.aboutDish')}</h3><p className="text-muted-foreground">{selectedDish.description}</p></div>
                <div><h3 className="font-semibold text-lg mb-2">{t('culture.whyMainstream')}</h3><p className="text-muted-foreground">{selectedDish.history}</p></div>
                <div><h3 className="font-semibold text-lg mb-2">{t('culture.whereToFind')}</h3><p className="text-muted-foreground">{selectedDish.whereToFind}</p></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CultureSection;
