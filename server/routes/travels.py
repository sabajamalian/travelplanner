"""
Travel Routes Module

This module contains all the travel-related API endpoints for the Travel Planner application.
Routes handle CRUD operations for travels including soft delete and restore functionality.
"""

from fastapi import APIRouter, HTTPException, Depends, Request, status, Query
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, date
from pydantic import BaseModel, Field

# Import database connection
from database.db import fetch_all, fetch_one, execute_query

# Import validation middleware
from middleware.validation import validate_request_data, sanitize_input

# Import error handling utilities
from middleware.error_handler import CustomHTTPException, create_error_response, log_error

# Import logging utilities
from middleware.logger import log_user_action, log_business_event

# Setup router
router = APIRouter(
    prefix="/travels",
    tags=["travels"],
    responses={
        404: {"description": "Travel not found"},
        400: {"description": "Bad request"},
        500: {"description": "Internal server error"}
    }
)

# Setup logging
logger = logging.getLogger(__name__)

# Pydantic models for response
class TravelResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_date: str
    end_date: str
    destination: Optional[str] = None
    created_at: str
    updated_at: str

class DeletedTravelResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_date: str
    end_date: str
    destination: Optional[str] = None
    is_deleted: int
    deleted_at: str
    created_at: str

class PaginationInfo(BaseModel):
    page: int
    limit: int
    total: int
    pages: int

class TravelListResponse(BaseModel):
    success: bool = True
    data: List[TravelResponse]
    pagination: PaginationInfo

class DeletedTravelListResponse(BaseModel):
    success: bool = True
    data: List[DeletedTravelResponse]
    pagination: PaginationInfo

# Route: GET / - List all active travels
@router.get("/", response_model=TravelListResponse)
async def list_travels(
    request: Request,
    limit: int = Query(10, ge=1, le=100, description="Maximum number of travels to return"),
    offset: int = Query(0, ge=0, description="Number of travels to skip"),
    title: Optional[str] = Query(None, description="Filter by title (partial match)"),
    destination: Optional[str] = Query(None, description="Filter by destination (partial match)"),
    start_date_from: Optional[str] = Query(None, description="Filter by start date (YYYY-MM-DD)"),
    start_date_to: Optional[str] = Query(None, description="Filter by start date (YYYY-MM-DD)"),
    end_date_from: Optional[str] = Query(None, description="Filter by end date (YYYY-MM-DD)"),
    end_date_to: Optional[str] = Query(None, description="Filter by end date (YYYY-MM-DD)")
):
    """
    List all active travels with optional filtering and pagination.
    
    Args:
        request: FastAPI request object
        limit: Maximum number of travels to return (1-100, default: 10)
        offset: Number of travels to skip (default: 0)
        title: Filter by title (partial match)
        destination: Filter by destination (partial match)
        start_date_from: Filter by start date from (YYYY-MM-DD)
        start_date_to: Filter by start date to (YYYY-MM-DD)
        end_date_from: Filter by end date from (YYYY-MM-DD)
        end_date_to: Filter by end date to (YYYY-MM-DD)
    
    Returns:
        Paginated list of active travels with metadata
    """
    try:
        # Log the request
        logger.info(f"Listing travels - limit: {limit}, offset: {offset}, filters: title={title}, destination={destination}, start_date_from={start_date_from}, start_date_to={start_date_to}, end_date_from={end_date_from}, end_date_to={end_date_to}")
        
        # Validate date parameters
        date_filters = {}
        if start_date_from:
            try:
                datetime.strptime(start_date_from, "%Y-%m-%d")
                date_filters["start_date_from"] = start_date_from
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid start_date_from format. Use YYYY-MM-DD"
                )
        
        if start_date_to:
            try:
                datetime.strptime(start_date_to, "%Y-%m-%d")
                date_filters["start_date_to"] = start_date_to
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid start_date_to format. Use YYYY-MM-DD"
                )
        
        if end_date_from:
            try:
                datetime.strptime(end_date_from, "%Y-%m-%d")
                date_filters["end_date_from"] = end_date_from
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid end_date_from format. Use YYYY-MM-DD"
                )
        
        if end_date_to:
            try:
                datetime.strptime(end_date_to, "%Y-%m-%d")
                date_filters["end_date_to"] = end_date_to
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid end_date_to format. Use YYYY-MM-DD"
                )
        
        # Build the WHERE clause for filtering
        where_conditions = ["is_deleted = 0"]
        query_params = []
        
        if title:
            where_conditions.append("title LIKE ?")
            query_params.append(f"%{title}%")
        
        if destination:
            where_conditions.append("destination LIKE ?")
            query_params.append(f"%{destination}%")
        
        if start_date_from:
            where_conditions.append("start_date >= ?")
            query_params.append(start_date_from)
        
        if start_date_to:
            where_conditions.append("start_date <= ?")
            query_params.append(start_date_to)
        
        if end_date_from:
            where_conditions.append("end_date >= ?")
            query_params.append(end_date_from)
        
        if end_date_to:
            where_conditions.append("end_date <= ?")
            query_params.append(end_date_to)
        
        where_clause = " AND ".join(where_conditions)
        
        # Get total count for pagination
        count_query = f"SELECT COUNT(*) as total FROM travels WHERE {where_clause}"
        count_result = fetch_one(count_query, tuple(query_params))
        total_count = count_result["total"] if count_result else 0
        
        # Calculate pagination info
        page = (offset // limit) + 1
        total_pages = (total_count + limit - 1) // limit
        
        # Get travels with pagination
        travels_query = f"""
            SELECT id, title, description, start_date, end_date, destination, created_at, updated_at
            FROM travels 
            WHERE {where_clause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        """
        
        # Add pagination parameters
        query_params.extend([limit, offset])
        
        # Execute query
        travels_data = fetch_all(travels_query, tuple(query_params))
        
        # Transform data to response format
        travels = []
        for travel in travels_data:
            travels.append(TravelResponse(
                id=travel["id"],
                title=travel["title"],
                description=travel["description"],
                start_date=travel["start_date"],
                end_date=travel["end_date"],
                destination=travel["destination"],
                created_at=travel["created_at"],
                updated_at=travel["updated_at"]
            ))
        
        # Create pagination info
        pagination = PaginationInfo(
            page=page,
            limit=limit,
            total=total_count,
            pages=total_pages
        )
        
        # Create response
        response = TravelListResponse(
            success=True,
            data=travels,
            pagination=pagination
        )
        
        # Log the response
        logger.info(f"Successfully listed {len(travels)} travels out of {total_count} total")
        
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error
        log_error(e, request, {
            "endpoint": "list_travels", 
            "limit": limit, 
            "offset": offset, 
            "title": title,
            "destination": destination,
            "start_date_from": start_date_from,
            "start_date_to": start_date_to,
            "end_date_from": end_date_from,
            "end_date_to": end_date_to
        })
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list travels"
        )

# Route: GET /deleted - List deleted travels
@router.get("/deleted", response_model=DeletedTravelListResponse)
async def list_deleted_travels(
    request: Request,
    limit: int = Query(10, ge=1, le=100, description="Maximum number of deleted travels to return"),
    offset: int = Query(0, ge=0, description="Number of deleted travels to skip"),
    title: Optional[str] = Query(None, description="Filter by title (partial match)"),
    destination: Optional[str] = Query(None, description="Filter by destination (partial match)"),
    deleted_date_from: Optional[str] = Query(None, description="Filter by deletion date from (YYYY-MM-DD)"),
    deleted_date_to: Optional[str] = Query(None, description="Filter by deletion date to (YYYY-MM-DD)")
):
    """
    List all deleted travels with optional filtering and pagination.
    
    Args:
        request: FastAPI request object
        limit: Maximum number of deleted travels to return (1-100, default: 10)
        offset: Number of deleted travels to skip (default: 0)
        title: Filter by title (partial match)
        destination: Filter by destination (partial match)
        deleted_date_from: Filter by deletion date from (YYYY-MM-DD)
        deleted_date_to: Filter by deletion date to (YYYY-MM-DD)
    
    Returns:
        Paginated list of deleted travels with soft delete metadata
    """
    try:
        # Log the request
        logger.info(f"Listing deleted travels - limit: {limit}, offset: {offset}, filters: title={title}, destination={destination}, deleted_date_from={deleted_date_from}, deleted_date_to={deleted_date_to}")
        
        # Validate date parameters
        date_filters = {}
        if deleted_date_from:
            try:
                datetime.strptime(deleted_date_from, "%Y-%m-%d")
                date_filters["deleted_date_from"] = deleted_date_from
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid deleted_date_from format. Use YYYY-MM-DD"
                )
        
        if deleted_date_to:
            try:
                datetime.strptime(deleted_date_to, "%Y-MM-DD")
                date_filters["deleted_date_to"] = deleted_date_to
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid deleted_date_to format. Use YYYY-MM-DD"
                )
        
        # Build the WHERE clause for filtering
        where_conditions = ["is_deleted = 1"]
        query_params = []
        
        if title:
            where_conditions.append("title LIKE ?")
            query_params.append(f"%{title}%")
        
        if destination:
            where_conditions.append("destination LIKE ?")
            query_params.append(f"%{destination}%")
        
        if deleted_date_from:
            where_conditions.append("date(deleted_at) >= ?")
            query_params.append(deleted_date_from)
        
        if deleted_date_to:
            where_conditions.append("date(deleted_at) <= ?")
            query_params.append(deleted_date_to)
        
        where_clause = " AND ".join(where_conditions)
        
        # Get total count for pagination
        count_query = f"SELECT COUNT(*) as total FROM travels WHERE {where_clause}"
        count_result = fetch_one(count_query, tuple(query_params))
        total_count = count_result["total"] if count_result else 0
        
        # Calculate pagination info
        page = (offset // limit) + 1
        total_pages = (total_count + limit - 1) // limit
        
        # Get deleted travels with pagination
        travels_query = f"""
            SELECT id, title, description, start_date, end_date, destination, 
                   is_deleted, deleted_at, created_at
            FROM travels 
            WHERE {where_clause}
            ORDER BY deleted_at DESC
            LIMIT ? OFFSET ?
        """
        
        # Add pagination parameters
        query_params.extend([limit, offset])
        
        # Execute query
        travels_data = fetch_all(travels_query, tuple(query_params))
        
        # Transform data to response format
        deleted_travels = []
        for travel in travels_data:
            deleted_travels.append(DeletedTravelResponse(
                id=travel["id"],
                title=travel["title"],
                description=travel["description"],
                start_date=travel["start_date"],
                end_date=travel["end_date"],
                destination=travel["destination"],
                is_deleted=travel["is_deleted"],
                deleted_at=travel["deleted_at"],
                created_at=travel["created_at"]
            ))
        
        # Create pagination info
        pagination = PaginationInfo(
            page=page,
            limit=limit,
            total=total_count,
            pages=total_pages
        )
        
        # Create response
        response = DeletedTravelListResponse(
            success=True,
            data=deleted_travels,
            pagination=pagination
        )
        
        # Log the response
        logger.info(f"Successfully listed {len(deleted_travels)} deleted travels out of {total_count} total")
        
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error
        log_error(e, request, {
            "endpoint": "list_deleted_travels", 
            "limit": limit, 
            "offset": offset, 
            "title": title,
            "destination": destination,
            "deleted_date_from": deleted_date_from,
            "deleted_date_to": deleted_date_to
        })
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list deleted travels"
        )

# Health check endpoint for travels module
@router.get("/health", include_in_schema=False)
async def travels_health_check():
    """
    Health check endpoint for the travels module.
    
    Returns:
        Health status of the travels module
    """
    return {
        "status": "healthy",
        "module": "travels",
        "endpoints": [
            "GET /",
            "GET /deleted",
            "POST /",
            "GET /{id}",
            "PUT /{id}",
            "DELETE /{id}",
            "POST /{id}/restore"
        ]
    }

# Route: POST / - Create new travel
@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_travel(
    request: Request,
    travel_data: Dict[str, Any]
):
    """
    Create a new travel.
    
    Args:
        request: FastAPI request object
        travel_data: Travel data from request body
    
    Returns:
        Created travel information
    """
    try:
        # Log the request
        logger.info(f"Creating new travel - data: {travel_data}")
        
        # TODO: Implement travel creation logic
        # This will be implemented in the next phase
        
        # Placeholder response
        created_travel = {
            "id": 1,
            "title": travel_data.get("title", ""),
            "description": travel_data.get("description", ""),
            "start_date": travel_data.get("start_date"),
            "end_date": travel_data.get("end_date"),
            "user_id": travel_data.get("user_id"),
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
        
        # Log the business event
        log_business_event("travel_created", "travel", str(created_travel["id"]), travel_data)
        
        # Log the response
        logger.info(f"Successfully created travel with ID: {created_travel['id']}")
        
        return created_travel
        
    except Exception as e:
        # Log the error
        log_error(e, request, {"endpoint": "create_travel", "travel_data": travel_data})
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create travel"
        )

# Route: GET /:id - Get single travel
@router.get("/{travel_id}", response_model=Dict[str, Any])
async def get_travel(
    request: Request,
    travel_id: int
):
    """
    Get a single travel by ID.
    
    Args:
        request: FastAPI request object
        travel_id: ID of the travel to retrieve
    
    Returns:
        Travel information
    """
    try:
        # Log the request
        logger.info(f"Getting travel with ID: {travel_id}")
        
        # TODO: Implement travel retrieval logic
        # This will be implemented in the next phase
        
        # Placeholder response
        travel = {
            "id": travel_id,
            "title": "Sample Travel",
            "description": "Sample description",
            "start_date": "2024-01-01",
            "end_date": "2024-01-07",
            "user_id": 1,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
        
        # Log the response
        logger.info(f"Successfully retrieved travel with ID: {travel_id}")
        
        return travel
        
    except Exception as e:
        # Log the error
        log_error(e, request, {"endpoint": "get_travel", "travel_id": travel_id})
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve travel"
        )

# Route: PUT /:id - Update travel
@router.put("/{travel_id}", response_model=Dict[str, Any])
async def update_travel(
    request: Request,
    travel_id: int,
    travel_data: Dict[str, Any]
):
    """
    Update an existing travel.
    
    Args:
        request: FastAPI request object
        travel_id: ID of the travel to update
        travel_data: Updated travel data from request body
    
    Returns:
        Updated travel information
    """
    try:
        # Log the request
        logger.info(f"Updating travel with ID: {travel_id} - data: {travel_data}")
        
        # TODO: Implement travel update logic
        # This will be implemented in the next phase
        
        # Placeholder response
        updated_travel = {
            "id": travel_id,
            "title": travel_data.get("title", "Updated Title"),
            "description": travel_data.get("description", "Updated description"),
            "start_date": travel_data.get("start_date"),
            "end_date": travel_data.get("end_date"),
            "user_id": travel_data.get("user_id", 1),
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
        
        # Log the business event
        log_business_event("travel_updated", "travel", str(travel_id), travel_data)
        
        # Log the response
        logger.info(f"Successfully updated travel with ID: {travel_id}")
        
        return updated_travel
        
    except Exception as e:
        # Log the error
        log_error(e, request, {"endpoint": "update_travel", "travel_id": travel_id, "travel_data": travel_data})
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update travel"
        )

# Route: DELETE /:id - Soft delete travel
@router.delete("/{travel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_travel(
    request: Request,
    travel_id: int
):
    """
    Soft delete a travel (mark as deleted without removing from database).
    
    Args:
        request: FastAPI request object
        travel_id: ID of the travel to delete
    
    Returns:
        No content (204 status)
    """
    try:
        # Log the request
        logger.info(f"Soft deleting travel with ID: {travel_id}")
        
        # TODO: Implement travel soft delete logic
        # This will be implemented in the next phase
        
        # Log the business event
        log_business_event("travel_deleted", "travel", str(travel_id), {})
        
        # Log the response
        logger.info(f"Successfully soft deleted travel with ID: {travel_id}")
        
        # Return 204 No Content
        return None
        
    except Exception as e:
        # Log the error
        log_error(e, request, {"endpoint": "delete_travel", "travel_id": travel_id})
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete travel"
        )

# Route: POST /:id/restore - Restore deleted travel
@router.post("/{travel_id}/restore", response_model=Dict[str, Any])
async def restore_travel(
    request: Request,
    travel_id: int
):
    """
    Restore a previously deleted travel.
    
    Args:
        request: FastAPI request object
        travel_id: ID of the travel to restore
    
    Returns:
        Restored travel information
    """
    try:
        # Log the request
        logger.info(f"Restoring travel with ID: {travel_id}")
        
        # TODO: Implement travel restore logic
        # This will be implemented in the next phase
        
        # Placeholder response
        restored_travel = {
            "id": travel_id,
            "title": "Restored Travel",
            "description": "Restored description",
            "start_date": "2024-01-01",
            "end_date": "2024-01-07",
            "user_id": 1,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z",
            "deleted_at": None
        }
        
        # Log the business event
        log_business_event("travel_restored", "travel", str(travel_id), {})
        
        # Log the response
        logger.info(f"Successfully restored travel with ID: {travel_id}")
        
        return restored_travel
        
    except Exception as e:
        # Log the error
        log_error(e, request, {"endpoint": "restore_travel", "travel_id": travel_id})
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to restore travel"
        )


