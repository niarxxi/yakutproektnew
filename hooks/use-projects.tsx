"use client";

import { useMemo } from "react";
import type { ProjectCategory } from "@/types/project";
import { processImages } from "@/utils/imageUtils";

// Массив путей к изображениям в формате WebP для лучшей производительности
const mockImagePaths = [
  // Жилые здания
  "/images/projects/LivingBuilding/LB1.webp",
  "/images/projects/LivingBuilding/LB2.webp",
  "/images/projects/LivingBuilding/LB3.webp",
  "/images/projects/LivingBuilding/LB4.webp",
  "/images/projects/LivingBuilding/LB5.webp",
  "/images/projects/LivingBuilding/LB6.webp",
  "/images/projects/LivingBuilding/LB7.webp",
  "/images/projects/LivingBuilding/LB8.webp",
  "/images/projects/LivingBuilding/LB9.webp",
  "/images/projects/LivingBuilding/LB10.webp",
  "/images/projects/LivingBuilding/LB11.webp",
  "/images/projects/LivingBuilding/LB12.webp",
  "/images/projects/LivingBuilding/LB13.webp",
  "/images/projects/LivingBuilding/LB14.webp",

  // Общественные здания
  "/images/projects/PublicBuildings/PB1.webp",
  "/images/projects/PublicBuildings/PB2.webp",
  "/images/projects/PublicBuildings/PB3.webp",
  "/images/projects/PublicBuildings/PB4.webp",
  "/images/projects/PublicBuildings/PB5.webp",
  "/images/projects/PublicBuildings/PB6.webp",
  "/images/projects/PublicBuildings/PB7.webp",
  "/images/projects/PublicBuildings/PB8.webp",
  "/images/projects/PublicBuildings/PB9.webp",
  "/images/projects/PublicBuildings/PB10.webp",
  "/images/projects/PublicBuildings/PB11.webp",
  "/images/projects/PublicBuildings/PB12.webp",
  "/images/projects/PublicBuildings/PB13.webp",
  "/images/projects/PublicBuildings/PB14.webp",
  "/images/projects/PublicBuildings/PB15.webp",
  "/images/projects/PublicBuildings/PB16.webp",
  "/images/projects/PublicBuildings/PB17.webp",
  "/images/projects/PublicBuildings/PB18.webp",
  "/images/projects/PublicBuildings/PB19.webp",
  "/images/projects/PublicBuildings/PB20.webp",
  "/images/projects/PublicBuildings/PB21.webp",
  "/images/projects/PublicBuildings/PB22.webp",
  "/images/projects/PublicBuildings/PB23.webp",
  "/images/projects/PublicBuildings/PB24.webp",
  "/images/projects/PublicBuildings/PB25.webp",

  // Медицинские учреждения
  "/images/projects/HealthFacilities/HF1.webp",
  "/images/projects/HealthFacilities/HF2.webp",
  "/images/projects/HealthFacilities/HF3.webp",
  "/images/projects/HealthFacilities/HF4.webp",

  // Образовательные учреждения
  "/images/projects/SchoolInstitutions/SI1.webp",
  "/images/projects/SchoolInstitutions/SI2.webp",
  "/images/projects/SchoolInstitutions/SI3.webp",
  "/images/projects/SchoolInstitutions/SI4.webp",
  "/images/projects/SchoolInstitutions/SI5.webp",
  "/images/projects/SchoolInstitutions/SI6.webp",

  // Спортивные сооружения
  "/images/projects/SportBuildings/SB1.webp",
  "/images/projects/SportBuildings/SB2.webp",
  "/images/projects/SportBuildings/SB3.webp",
  "/images/projects/SportBuildings/SB4.webp",
  "/images/projects/SportBuildings/SB5.webp",
  "/images/projects/SportBuildings/SB6.webp",

  // Генеральные планы
  "/images/projects/GeneralPlans/GP1.webp",
  "/images/projects/GeneralPlans/GP2.webp",
  "/images/projects/GeneralPlans/GP3.webp",
  "/images/projects/GeneralPlans/GP4.webp",
  "/images/projects/GeneralPlans/GP5.webp",
  "/images/projects/GeneralPlans/GP6.webp",
  "/images/projects/GeneralPlans/GP7.webp",
  "/images/projects/GeneralPlans/GP8.webp",

  // Сельскохозяйственные объекты
  "/images/projects/AgriculturalFacilities/AF1.webp",
  "/images/projects/AgriculturalFacilities/AF2.webp",
];

export function useProjects() {
  const projectImages = useMemo(() => {
    return processImages(mockImagePaths);
  }, []);

  const projectCategories = useMemo(() => {
    const categoryMap: Record<string, ProjectCategory> = {
      living: {
        id: "living",
        name: "Жилые здания",
        count: 0,
      },
      public: {
        id: "public",
        name: "Общественные здания",
        count: 0,
      },
      health: {
        id: "health",
        name: "Медицинские учреждения",
        count: 0,
      },
      education: {
        id: "education",
        name: "Образовательные учреждения",
        count: 0,
      },
      sport: {
        id: "sport",
        name: "Спортивные сооружения",
        count: 0,
      },
      plans: {
        id: "plans",
        name: "Генеральные планы",
        count: 0,
      },
      agriculture: {
        id: "agriculture",
        name: "Сельскохозяйственные объекты",
        count: 0,
      },
    };

    // Подсчет количества проектов в каждой категории
    projectImages.forEach((image) => {
      const categoryNameToId: Record<string, string> = {
        "Жилые здания": "living",
        "Общественные здания": "public",
        "Медицинские учреждения": "health",
        "Образовательные учреждения": "education",
        "Спортивные сооружения": "sport",
        "Генеральные планы": "plans",
        "Сельскохозяйственные объекты": "agriculture",
      };

      const categoryId = categoryNameToId[image.category];
      if (categoryId && categoryMap[categoryId]) {
        categoryMap[categoryId].count++;
      }
    });

    return Object.values(categoryMap);
  }, [projectImages]);

  return {
    projectImages,
    projectCategories,
  };
}
