import { Flex, Grid, GridItem, Spacer } from "@chakra-ui/react";
import Header from "./pages/header";
import NavBar from "./pages/nav-bar";

const Layout = ({ children }) => (
      <Grid
      templateAreas={`"header"
                      "nav main"
                      "footer"`}
      gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'repeat(2, 1fr)'}
      h='100%'
      gap='4'
      color='blackAlpha.700'
      fontWeight='bold'
  >
    <GridItem rowSpan={3} colSpan={4} pl='2' bg='white.300' area={'nav'}>
        <Flex marginTop={5}>
            <Header />
            <Spacer />
            <NavBar />
        </Flex>
    </GridItem>
    <GridItem rowSpan={10} colSpan={4} margin={20} pl='4' bg='white.300' area={'main'}>
        {children}
    </GridItem>
    {/* <GridItem rowSpan={2} colSpan={4} pl='2' bg='blue.300' area={'footer'}>
        Footer
    </GridItem> */}
  </Grid>
);

export default Layout;