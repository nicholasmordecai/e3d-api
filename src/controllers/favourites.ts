import * as Express from 'express';
import { BadRequest, NotFound, Success, InternalServerError } from '../utils/respond';
import { Favourites } from './../models/favourites';