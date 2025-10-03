import { AppShell, Burger, Divider, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import { ClipboardList, Newspaper } from "lucide-react";

// export async function loader() {
//
// }

export default function RouteComponent() {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const initUser = async () => {
    const doSessionExist = await supabase.auth.getSession();
    if (!doSessionExist.data.session) {
      return navigate("/login");
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "lg",
        collapsed: { mobile: !opened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="lg"
            size="sm"
          />
          Header
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" />
          <p className="text-xl font-bold text-brand">CMS Platform</p>
        </Group>

        <Divider className="my-3" />

        <div className="navigation-links flex flex-col gap-3">
          <NavLink
            label="Home (Articles)"
            component={Link}
            to={"/editor"}
            leftSection={<Newspaper size={18} />}
          />
          <NavLink
            label="Articles Categories"
            component={Link}
            to={"/editor/category"}
            leftSection={<ClipboardList size={18} />}
          />
        </div>
      </AppShell.Navbar>
      <AppShell.Main className="!pb-5">
        <div className="pt-5">
          <Outlet />
        </div>
      </AppShell.Main>

      {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
    </AppShell>
  );
}
