import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CreditsBlock from "./CreditsBlock";

// ─── CreditsBlock ─────────────────────────────────────────────────────────────

describe("CreditsBlock — director", () => {
  it("renders the director's name", () => {
    render(
      <CreditsBlock
        director="Alfred Hitchcock"
        actors={[]}
        productionCompany={null}
      />,
    );
    expect(screen.getByText("Alfred Hitchcock")).toBeInTheDocument();
  });

  it("renders the DIRECTOR label alongside the name", () => {
    render(
      <CreditsBlock
        director="Alfred Hitchcock"
        actors={[]}
        productionCompany={null}
      />,
    );
    expect(screen.getByText("DIRECTOR")).toBeInTheDocument();
  });

  it("omits the director row entirely when director is null", () => {
    render(
      <CreditsBlock director={null} actors={[]} productionCompany={null} />,
    );
    expect(screen.queryByText("DIRECTOR")).not.toBeInTheDocument();
  });
});

describe("CreditsBlock — cast", () => {
  it("renders multiple actors joined by a comma", () => {
    render(
      <CreditsBlock
        director={null}
        actors={["James Stewart", "Kim Novak"]}
        productionCompany={null}
      />,
    );
    expect(screen.getByText("James Stewart, Kim Novak")).toBeInTheDocument();
  });

  it("renders a single actor without a trailing comma", () => {
    render(
      <CreditsBlock
        director={null}
        actors={["James Stewart"]}
        productionCompany={null}
      />,
    );
    expect(screen.getByText("James Stewart")).toBeInTheDocument();
  });

  it("renders the CAST label alongside the actors", () => {
    render(
      <CreditsBlock
        director={null}
        actors={["James Stewart"]}
        productionCompany={null}
      />,
    );
    expect(screen.getByText("CAST")).toBeInTheDocument();
  });

  it("omits the cast row when actors array is empty", () => {
    render(
      <CreditsBlock director={null} actors={[]} productionCompany={null} />,
    );
    expect(screen.queryByText("CAST")).not.toBeInTheDocument();
  });
});

describe("CreditsBlock — production company", () => {
  it("renders the production company name", () => {
    render(
      <CreditsBlock
        director={null}
        actors={[]}
        productionCompany="Paramount Pictures"
      />,
    );
    expect(screen.getByText("Paramount Pictures")).toBeInTheDocument();
  });

  it("renders the PRODUCTION label alongside the company", () => {
    render(
      <CreditsBlock
        director={null}
        actors={[]}
        productionCompany="Paramount Pictures"
      />,
    );
    expect(screen.getByText("PRODUCTION")).toBeInTheDocument();
  });

  it("omits the production row when productionCompany is null", () => {
    render(
      <CreditsBlock director={null} actors={[]} productionCompany={null} />,
    );
    expect(screen.queryByText("PRODUCTION")).not.toBeInTheDocument();
  });
});

describe("CreditsBlock — combined", () => {
  it("renders all three rows when all props are provided", () => {
    render(
      <CreditsBlock
        director="Alfred Hitchcock"
        actors={["James Stewart"]}
        productionCompany="Paramount Pictures"
      />,
    );
    expect(screen.getByText("DIRECTOR")).toBeInTheDocument();
    expect(screen.getByText("CAST")).toBeInTheDocument();
    expect(screen.getByText("PRODUCTION")).toBeInTheDocument();
  });

  it("renders an empty container when all props are absent", () => {
    const { container } = render(
      <CreditsBlock director={null} actors={[]} productionCompany={null} />,
    );
    // outer div still in the DOM but has no visible text rows
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText("DIRECTOR")).not.toBeInTheDocument();
    expect(screen.queryByText("CAST")).not.toBeInTheDocument();
    expect(screen.queryByText("PRODUCTION")).not.toBeInTheDocument();
  });

  it("renders only the provided rows (director only)", () => {
    render(
      <CreditsBlock
        director="Alfred Hitchcock"
        actors={[]}
        productionCompany={null}
      />,
    );
    expect(screen.getByText("DIRECTOR")).toBeInTheDocument();
    expect(screen.queryByText("CAST")).not.toBeInTheDocument();
    expect(screen.queryByText("PRODUCTION")).not.toBeInTheDocument();
  });
});

describe("CreditsBlock — snapshots", () => {
  it("matches snapshot with all credits populated", () => {
    const { container } = render(
      <CreditsBlock
        director="Alfred Hitchcock"
        actors={["James Stewart", "Kim Novak"]}
        productionCompany="Paramount Pictures"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with no credits", () => {
    const { container } = render(
      <CreditsBlock director={null} actors={[]} productionCompany={null} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with cast only", () => {
    const { container } = render(
      <CreditsBlock
        director={null}
        actors={["James Stewart", "Kim Novak"]}
        productionCompany={null}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
