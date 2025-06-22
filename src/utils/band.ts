import { MOCK_BANDS_WITH_POSITIONS } from "@/constants/database/bands";
import { CreateBandInput } from "@/models/band";
import { BandPosition, CreateBandPositionInput } from "@/models/band-position";
import { createBandPositions } from "@/services/bandPositionService";
import { createBand, updateBand } from "@/services/bandsService";
import { handleDBResult } from "./database";

export const getPositionsByStatus = (
  positions: CreateBandPositionInput[] | BandPosition[]
) => {
  const recruitingPositions = positions.filter(
    (p) => p.status === "recruiting"
  );
  const occupiedPositions = positions.filter((p) => p.status === "occupied");
  return { recruitingPositions, occupiedPositions };
};

interface GetBandWithPositionsParams {
  bandID: string;
  production?: boolean;
}

export const getBandWithPositions = async ({
  bandID,
  production = false,
}: GetBandWithPositionsParams) => {
  if (!production) return MOCK_BANDS_WITH_POSITIONS.active[0];
};

interface CreateBandWithPositionsParams {
  positions: CreateBandPositionInput[];
  band: CreateBandInput;
}

export const createBandWithPositions = async ({
  positions,
  band,
}: CreateBandWithPositionsParams) => {
  const bandID = await createBand(band);
  if (!bandID) return false;

  const bandPositionIDs = await createBandPositions({
    positions,
    bandID,
  });
  if (!bandPositionIDs) return false;

  const res = await updateBand({
    bandID,
    data: { bandPositionIDs },
  });

  return res;
};
