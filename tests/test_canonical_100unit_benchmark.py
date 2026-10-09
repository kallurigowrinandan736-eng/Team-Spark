"""
Tests for Canonical 100-Unit Water Scarcity Benchmark (Part 1.2 Specification)
=============================================================================
Tests:
- 100 units supply vs 140 units demand across Crop A, B, C, D
- 40-unit system shortage detection
- Priority-weighted Classical LP solver
- Proportional fair baseline solver
- Quantum QUBO & QAOA variational solver
- Multi-scenario evaluation (Drought 60, Normal 100, Surplus 160)
"""

import pytest
from app.optimization.benchmark_fixture import Benchmark100UnitFixture


def test_100unit_problem_definition():
    """Verify system correctly identifies the 100-unit supply and 40-unit deficit."""
    fixture = Benchmark100UnitFixture(usable_water=100.0)
    assert fixture.usable_water == 100.0
    assert fixture.total_demand == 140.0
    assert fixture.system_shortage == 40.0
    assert len(fixture.crops) == 4


def test_classical_priority_lp_solution():
    """Verify Classical LP satisfies supply constraints and prioritizes high-value crops."""
    fixture = Benchmark100UnitFixture(usable_water=100.0)
    res = fixture.solve_classical_priority_lp()

    assert res["constraints_satisfied"] is True
    assert res["total_allocated_units"] <= 100.001
    assert abs(res["total_allocated_units"] - 100.0) < 0.1
    assert abs(res["total_unmet_units"] - 40.0) < 0.1

    # Crop A (priority 1, demand 20) and Crop B (priority 2, demand 30) must be 100% satisfied
    breakdown = {c["crop_id"]: c for c in res["crop_breakdown"]}
    assert breakdown["crop_a"]["allocated"] == 20.0
    assert breakdown["crop_b"]["allocated"] == 30.0


def test_proportional_fair_baseline_solution():
    """Verify Proportional Baseline shares the 40-unit cut proportionally across all crops."""
    fixture = Benchmark100UnitFixture(usable_water=100.0)
    res = fixture.solve_proportional_fair_baseline()

    assert res["constraints_satisfied"] is True
    assert res["total_allocated_units"] <= 100.01
    assert res["jains_fairness_index"] > 0.99  # Proportional has near-perfect fairness (equal cut ratio)


def test_quantum_qubo_solution():
    """Verify Quantum QUBO minimum energy ground state honors the 100-unit limit."""
    fixture = Benchmark100UnitFixture(usable_water=100.0)
    res = fixture.solve_quantum_qubo_qaoa()

    assert res["constraints_satisfied"] is True
    assert res["total_allocated_units"] <= 100.0
    assert "qubo_energy" in res
    assert res["demand_satisfaction_pct"] > 60.0


def test_multi_scenario_comparison():
    """Verify multi-scenario benchmark across Drought, Benchmark, and Surplus."""
    fixture = Benchmark100UnitFixture(usable_water=100.0)
    comparison = fixture.run_multi_scenario_comparison()

    assert "Drought (60 Units)" in comparison
    assert "Standard Benchmark (100 Units)" in comparison
    assert "Surplus / Monsoon (160 Units)" in comparison

    drought_lp = comparison["Drought (60 Units)"]["lp_solution"]
    assert drought_lp["total_allocated_units"] <= 60.001

    surplus_lp = comparison["Surplus / Monsoon (160 Units)"]["lp_solution"]
    assert surplus_lp["total_allocated_units"] == 140.0  # All demand fully met
