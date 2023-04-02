import { useContext } from "react";
import Head from "next/head";
import withAuth from "../../lib/withAuth";
import { useRouter } from "next/router";
import { IconSun, IconMoonStars } from "@tabler/icons";
import { LoginContext } from "../../lib/contexts/LoginContext";

import {
  Button,
  Container,
  Title,
  ActionIcon,
  createStyles,
  Anchor,
  useMantineColorScheme,
} from "@mantine/core";
import { SideNav } from "../../components/Application/Dashboard/Sidebar";
import Breadcrumb from "../../components/utils/BreadCrumbs";
import Home from "./home";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: "#32CD32",
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

const Pages = ({ children, title }) => {
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: title, href: "/dashboard/users" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <>
      <Head>
        <title>ServiceHub | Dashboard</title>
      </Head>
      <div className="mx-auto py-8 w-full">
        <SideNav activeItem={title || "Home"} />
        <main className="mt-16">
          <Container size="xl">
            <div className="flex items-center justify-between">
              <Breadcrumb items={breadcrumbs} />
              <Title order={3} className="text-gray-500 text-center mb-2">
                {title}
              </Title>
              {/* Dark mode Switch */}
              <p className="flex justify-end mr-10">
                <ActionIcon
                  variant="outline"
                  color={dark ? "yellow" : "green"}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {dark ? (
                    <IconSun size="1.1rem" />
                  ) : (
                    <IconMoonStars size="1.1rem" />
                  )}
                </ActionIcon>
              </p>
            </div>
            {/* Dashboard Pages */}
            <div>{children}</div>
          </Container>
        </main>
      </div>
    </>
  );
};

export default withAuth(Pages);
