import { Stack } from "expo-router";
import { usePathname } from "expo-router";

export type ProjectRouteParams = {
  id: string;
  title: string;
};

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
