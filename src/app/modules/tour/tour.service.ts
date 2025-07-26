import { excludedFields } from "../../constants";
import { tourSearchableFields } from "./tour.const";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// CREAT TOUR
const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const baseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }

  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

// GET ALL TOURS
const getAllTours = async (query: Record<string, string>) => {
  const filter = query;

  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";
  const fields = query.fields?.split(",").join(" ") || "";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  for (const field of excludedFields) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field];
  }

  const searchQuery = {
    $or: tourSearchableFields.map((field) => {
      return { [field]: { $regex: searchTerm, $options: "i" } };
    }),
  };

  const tours = await Tour.find(searchQuery)
    .find(filter)
    .sort(sort)
    .select(fields)
    .skip(skip);

  const totalTours = await Tour.countDocuments();

  const meta = {
    page: page,
    limit: limit,
    total: totalTours,
  };

  return {
    data: tours,
    meta: meta,
  };
};

// UPDATE TOUR
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  if (payload.title) {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`; //
    }

    payload.slug = slug;
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};

// delete a tour
const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

/*/ TOUR TYPE /*/

// create a tour type
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name: payload });
};

// get all tour types
const getAllTourTypes = async () => {
  return await TourType.find();
};

// update a tour type
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};

// delete a tour type
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
};
