import type {
  AvailabilityWindow,
  Credential,
  DemoDataSet,
  EntityId,
  Organisation,
  ProfessionalProfile,
  StaffingRequest,
} from "../domain/types";
import { demoData } from "./demo-data";

export interface DemoRepository {
  getOrganisation(id: EntityId): Organisation | undefined;
  listProfessionals(): ProfessionalProfile[];
  getProfessional(id: EntityId): ProfessionalProfile | undefined;
  listCredentials(professionalId: EntityId): Credential[];
  listAvailability(professionalId: EntityId): AvailabilityWindow[];
  getStaffingRequest(id: EntityId): StaffingRequest | undefined;
}

export function createDemoRepository(data: DemoDataSet = demoData): DemoRepository {
  return {
    getOrganisation: (id) => data.organisations.find((organisation) => organisation.id === id),
    listProfessionals: () => data.professionals.map((professional) => ({ ...professional })),
    getProfessional: (id) => data.professionals.find((professional) => professional.id === id),
    listCredentials: (professionalId) =>
      data.credentials.filter((credential) => credential.professionalId === professionalId),
    listAvailability: (professionalId) =>
      data.availability.filter((window) => window.professionalId === professionalId),
    getStaffingRequest: (id) => data.staffingRequests.find((request) => request.id === id),
  };
}
