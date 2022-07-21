import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  createStyles,
  Menu,
  Center,
  Header,
  Collapse,
  Group,
  Button,
  Burger,
} from "@mantine/core";
import { useBooleanToggle, useWindowScroll } from "@mantine/hooks";
import { ChevronDown } from "tabler-icons-react";
import logo from "../../public/images/logo-1.webp";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

const links = [
  {
    link: "/about",
    label: "Features",
  },
  {
    link: "#1",
    label: "Learn",
    links: [
      {
        link: "/docs",
        label: "Documentation",
      },
      {
        link: "/resources",
        label: "Resources",
      },
      {
        link: "/community",
        label: "Community",
      },
      {
        link: "/blog",
        label: "Blog",
      },
    ],
  },
  {
    link: "/about",
    label: "About",
  },
  {
    link: "/pricing",
    label: "Pricing",
  },
  {
    link: "#2",
    label: "Support",
    links: [
      {
        link: "/faq",
        label: "FAQ",
      },
      {
        link: "/demo",
        label: "Book a demo",
      },
      {
        link: "/forums",
        label: "Forums",
      },
    ],
  },
];

export function Logo() {
  return (
    <Link href="/" passHref>
      <div className="mt-4 w-24 h-12 lg:w-36 lg:h-18">
        <a href="/a">
          <Image src={logo} alt="logo" />
        </a>
      </div>
    </Link>
  );
}

export default function AppHeader() {
  const { classes } = useStyles();
  const [scroll, scrollTo] = useWindowScroll();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          delay={0}
          transitionDuration={0}
          placement="end"
          gutter={1}
          control={
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <ChevronDown size={12} />
              </Center>
            </a>
          }
        >
          {menuItems}
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <Header
      className={`${
        scroll.y >= 60 && "shadow-md"
      } fixed transition-all duration-300 px-4 py-2 lg:px-8`}
    >
      <div className="flex w-full justify-between items-center">
        <Group>
          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
          />

          <Logo />
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <div>
          <Button className="rounded-full text-xs bg-primary shadow-sm mr-4">
            Signup
          </Button>
          <Button className="rounded-full text-xs border-primary bg-transparent text-gray-700 shadow-sm">
            Login
          </Button>
        </div>
      </div>
      <Collapse
        in={opened}
        className="pt-5 mb-3"
        // transitionDuration={300}
        // transitionTimingFunction="linear"
      >
        {items}
      </Collapse>
    </Header>
  );
}
