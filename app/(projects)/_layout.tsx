import { Stack } from "expo-router";
import { usePathname } from "expo-router";

export type ProjectRouteParams = {
  id: string;
  title: string;
};

/**
 * Projects Layout Component
 * 
 * Defines the navigation stack structure for the projects section of the app.
 * Configures two main routes:
 * - Index screen (projects list)
 * - Project details screen with dynamic routing
 * 
 * Uses expo-router Stack navigation with custom styling and dynamic headers.
 * 
 * */
export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={({ route }) => {
          const params = route.params as Partial<ProjectRouteParams>;
          return {
            title: params?.title || "Project Details",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          };
        }}
      />
    </Stack>
  );
}
