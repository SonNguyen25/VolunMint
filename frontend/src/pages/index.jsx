import { Flex, Grid, GridItem, Spacer } from "@chakra-ui/react";
import Header from "@/components/pages/header";
import NavBar from "@/components/pages/nav-bar";
import { useRouter } from "next/router";
import DynamicContent from "@/components/DynamicContent";
import Layout from "@/components/Layout";
import ProtectedRoute from '@/components/ProtectedRoutes';

export default function HomePage() {
  const router = useRouter();
  const { content } = router.query;

  // if (router.isFallback || !content) {
  //   return <div>Loading...</div>; // or any other loading state representation
  // }

  return (
    <></>
  )
}
