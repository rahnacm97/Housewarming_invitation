/**
 * Base Repository providing common database operations.
 * Implements Dependency Inversion Principle (DIP) by accepting the Model in its constructor.
 */
class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('A model must be provided to the Repository.');
    }
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async find(filter = {}, options = {}) {
    let query = this.model.find(filter);
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.skip) {
      query = query.skip(options.skip);
    }
    
    return await query.exec();
  }

  async findOne(filter) {
    return await this.model.findOne(filter).exec();
  }

  async findById(id) {
    return await this.model.findById(id).exec();
  }

  async update(filter, data) {
    return await this.model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter).exec();
  }
}

module.exports = BaseRepository;
