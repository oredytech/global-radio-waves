
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="bg-gowera-surface border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white mb-4">À propos de Gowera</CardTitle>
          <CardDescription className="text-gray-400">
            Votre passerelle vers un monde de radio en ligne
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Notre Mission</h3>
            <p>
              Gowera a été créé avec une vision simple mais puissante : rendre la radio accessible à tous, partout dans le monde. Nous croyons en la puissance de la radio pour connecter les cultures, partager les connaissances et divertir les auditeurs à travers le globe.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Ce que nous offrons</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accès à des milliers de stations de radio du monde entier</li>
              <li>Navigation facile par pays et par catégorie</li>
              <li>Lecture fluide et contrôle du volume intuitif</li>
              <li>Interface utilisateur moderne et responsive</li>
              <li>Actualités et mises à jour régulières du monde de la radio</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Notre Technologie</h3>
            <p>
              Nous utilisons les dernières technologies web pour vous offrir une expérience d'écoute optimale. Notre plateforme est construite avec des outils modernes comme React, garantissant une performance et une fiabilité excellentes.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Contact</h3>
            <p>
              Nous sommes toujours à l'écoute de nos utilisateurs. Pour toute question, suggestion ou commentaire, n'hésitez pas à nous contacter via notre page de contact.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
