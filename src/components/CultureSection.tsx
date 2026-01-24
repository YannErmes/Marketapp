import { useState } from "react";
import { useTranslation } from "react-i18next";
import beninFlag from "@/assets/flags/benin.png";
import burkinaFasoFlag from "@/assets/flags/burkina faso.png";
import comorosFlag from "@/assets/flags/comor.png";
import congoFlag from "@/assets/flags/congo.png";
import coteIvoryFlag from "@/assets/flags/cote ivore.png";
import djiboutiFlag from "@/assets/flags/djibouti.png";
import liberiaFlag from "@/assets/flags/libera.png";
import madagascarFlag from "@/assets/flags/madagascard.png";
import maliFlag from "@/assets/flags/mali.png";
import moroccoFlag from "@/assets/flags/maroc.png";
import mauritaniaFlag from "@/assets/flags/mauritania.png";
import nigerFlag from "@/assets/flags/niger.png";
import nigeriaFlag from "@/assets/flags/nigeria.png";
import senegalFlag from "@/assets/flags/senegal.png";
import togoFlag from "@/assets/flags/togo.png";
import { Card, CardContent } from "@/components/ui/card";
import Shimmer from "@/components/Shimmer";
import akassaImg from "@/assets/dish/Akassa.png";
import attiekeImg from "@/assets/dish/Attiéké with Grilled Fish.png";
import couscousImg from "@/assets/dish/Couscous.png";
import dambouImg from "@/assets/dish/Dambou.png";
import jollofImg from "@/assets/dish/Jollof Rice.png";
import langousteImg from "@/assets/dish/Langouste à la Vanille.png";
import palavaImg from "@/assets/dish/Palava Sauce.png";
import pouletMoambeImg from "@/assets/dish/Poulet Moambe.png";
import rizGrasImg from "@/assets/dish/Riz Gras.png";
import romazavaImg from "@/assets/dish/Romazava.png";
import skoudehkarisImg from "@/assets/dish/Skoudehkaris.png";
import thieboudienneImg from "@/assets/dish/Thieboudienne.png";
import fufuGraineImg from "@/assets/dish/Fufu with Sauce Graine.png";
import toWithOkraImg from "@/assets/dish/Tô with Okra Sauce.png";
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
  { country: "Benin", flagImage: beninFlag, dish: "Akassa (Ogui)", dishImage: akassaImg, description: "A fermented corn-based dish deeply rooted in Beninese traditions, often shared during family meals.", history: "Akassa is popular because it's affordable, nourishing, and symbolizes simplicity and togetherness.", whereToFind: "Found throughout Benin, especially in local markets in Cotonou and Porto-Novo." },
  { country: "Congo", flagImage: congoFlag, dish: "Poulet Moambe", dishImage: pouletMoambeImg, description: "A rich chicken stew made with palm nut sauce, considered a national treasure.", history: "Its popularity comes from its deep flavors and role in celebrations, reflecting Congolese hospitality.", whereToFind: "Best experienced in Brazzaville at traditional restaurants and family celebrations." },
  { country: "Togo", flagImage: togoFlag, dish: "Fufu with Sauce Graine", dishImage: fufuGraineImg, description: "A staple eaten daily, featuring pounded cassava with rich palm nut sauce.", history: "Fufu's importance lies in its communal eating style—meals are moments of unity.", whereToFind: "Available throughout Togo, especially in Lomé's local eateries." },
  { country: "Mali", flagImage: maliFlag, dish: "Tô with Okra Sauce", dishImage: toWithOkraImg, description: "A millet-based dish served with flavorful okra or peanut sauce.", history: "Reflects Mali's agrarian roots and resilience in rural communities.", whereToFind: "Found in every corner of Mali, from Bamako to village homes." },
  { country: "Madagascar", flagImage: madagascarFlag, dish: "Romazava", dishImage: romazavaImg, description: "A traditional meat and leafy greens stew with medicinal qualities.", history: "Represents harmony between food and nature in Malagasy culture.", whereToFind: "Served throughout Madagascar, especially in Antananarivo." },
  { country: "Burkina Faso", flagImage: burkinaFasoFlag, dish: "Riz Gras", dishImage: rizGrasImg, description: "A festive rice dish cooked with meat and rich seasonings.", history: "Popular because it's festive yet accessible, symbolizing generosity.", whereToFind: "Common at celebrations in Ouagadougou and Bobo-Dioulasso." },
  { country: "Comoros", flagImage: comorosFlag, dish: "Langouste à la Vanille", dishImage: langousteImg, description: "Fresh lobster prepared with world-famous vanilla.", history: "Showcases the islands' abundant seafood and unique identity.", whereToFind: "Best enjoyed on Grande Comore at coastal restaurants." },
  { country: "Djibouti", flagImage: djiboutiFlag, dish: "Skoudehkaris", dishImage: skoudehkarisImg, description: "A fragrant rice dish with meat and aromatic spices.", history: "Reflects Djibouti's crossroads position between cultures.", whereToFind: "Found in Djibouti City's traditional eateries." },
  { country: "Mauritania", flagImage: mauritaniaFlag, dish: "Thieboudienne", dishImage: thieboudienneImg, description: "Mauritania's version of the iconic rice and fish dish.", history: "Highlights the importance of rice and fish along the coast.", whereToFind: "Best in Nouakchott's coastal areas." },
  { country: "Ivory Coast", flagImage: coteIvoryFlag, dish: "Attiéké with Grilled Fish", dishImage: attiekeImg, description: "Fermented cassava couscous with perfectly grilled fish.", history: "A street-food favorite and symbol of Ivorian culinary pride.", whereToFind: "Found throughout Abidjan, especially in Treichville." },
  { country: "Liberia", flagImage: liberiaFlag, dish: "Palava Sauce", dishImage: palavaImg, description: "A rich leafy green stew with meat or fish.", history: "Represents comfort food and Liberian home cooking creativity.", whereToFind: "Best in Monrovia's local restaurants." },
  { country: "Senegal", flagImage: senegalFlag, dish: "Thieboudienne", dishImage: thieboudienneImg, description: "Africa's most famous dish with rice, fish, and vegetables.", history: "Reflects Senegalese values of sharing and craftsmanship.", whereToFind: "Found everywhere in Senegal, best in Dakar." },
  { country: "Niger", flagImage: nigerFlag, dish: "Dambou", dishImage: dambouImg, description: "Steamed grains with leafy vegetables.", history: "Reflects adaptation and survival in a harsh environment.", whereToFind: "Available throughout Niger, especially in Niamey." },
  { country: "Nigeria", flagImage: nigeriaFlag, dish: "Jollof Rice", dishImage: jollofImg, description: "Vibrant tomato-based rice, a party staple.", history: "Famous for its flavor and cultural pride.", whereToFind: "Found at every celebration in Nigeria." },
  { country: "Morocco", flagImage: moroccoFlag, dish: "Couscous", dishImage: couscousImg, description: "Steamed semolina with vegetables and aromatic spices.", history: "Represents hospitality and centuries of culinary refinement.", whereToFind: "Best in Marrakech and Fes at traditional riads." }
];

const CultureSection = () => {
  const [selectedDish, setSelectedDish] = useState<DishCard | null>(null);
  const { t } = useTranslation();

  const DishImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div className={`relative ${className}`}>
        {!loaded && (
          <div className="absolute inset-0">
            <Shimmer className="w-full h-full" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    );
  };

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
                  <DishImage src={dish.dishImage} alt={dish.dish} className="w-full h-full" />
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 md:border-4 border-primary shadow-lg bg-background">
                    <img src={dish.flagImage} alt={`${dish.country} flag`} className="w-full h-full object-cover" loading="lazy" />
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
                  <DishImage src={selectedDish.dishImage} alt={selectedDish.dish} className="w-full h-64" />
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
