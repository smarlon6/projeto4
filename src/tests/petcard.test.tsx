import { render, screen } from "@testing-library/react";
import { PetCard } from "../features/pets/components/PetCard";

test("renderiza nome e idade do pet", () => {
  render(<PetCard pet={{ id: 1, nome: "Rex", raca: "Vira-lata", idade: 3, foto: null }} />);
  expect(screen.getByText("Rex")).toBeInTheDocument();
  expect(screen.getByText("3 ano(s)")).toBeInTheDocument();
});
