import { MenuItem } from "@/hooks/useMenuReview";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

interface MealGridProps {
  menuItems: MenuItem[];
}

export function MealGrid({ menuItems }: MealGridProps) {
  const getMealForSlot = (day: string, mealType: string) => {
    return menuItems.find(
      (item) => 
        item.day?.toLowerCase() === day.toLowerCase() &&
        item.meal_type?.toLowerCase() === mealType.toLowerCase()
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-border bg-muted px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              Meal
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="border border-border bg-muted px-3 py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEAL_TYPES.map((mealType) => (
            <tr key={mealType}>
              <td className="border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                {mealType}
              </td>
              {DAYS.map((day) => {
                const meal = getMealForSlot(day, mealType);
                return (
                  <td
                    key={`${day}-${mealType}`}
                    className="border border-border p-2"
                  >
                    {meal?.recipe ? (
                      <div className="min-w-[100px] space-y-1">
                        <p className="text-xs font-medium leading-tight text-foreground">
                          {meal.recipe.name}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] px-1.5 py-0"
                        >
                          {meal.recipe.total_calories ?? 0} kcal
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
