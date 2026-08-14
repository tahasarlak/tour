import NavbarClient from "./NavbarClient";
import AdminStatus from "./admin/AdminStatus";


export default async function Navbar(){

  return (
    <NavbarClient>
      <AdminStatus />
    </NavbarClient>
  );

}