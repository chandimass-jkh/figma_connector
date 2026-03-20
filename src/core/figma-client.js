/**
 * Figma API Client
 * Handles all communication with the Figma REST API
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class FigmaClient {
  constructor(accessToken = process.env.FIGMA_ACCESS_TOKEN) {
    if (!accessToken) {
      throw new Error('Figma access token is required');
    }

    this.accessToken = accessToken;
    this.baseURL = 'https://api.figma.com/v1';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });
  }

  /**
   * Get current user info
   */
  async getMe() {
    const response = await this.client.get('/me');
    return response.data;
  }

  /**
   * Get file info
   */
  async getFile(fileKey) {
    const response = await this.client.get(`/files/${fileKey}`);
    return response.data;
  }

  /**
   * Get file nodes
   */
  async getFileNodes(fileKey, nodeIds) {
    const ids = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
    const response = await this.client.get(`/files/${fileKey}/nodes`, {
      params: { ids },
    });
    return response.data;
  }

  /**
   * Post comment to file
   */
  async postComment(fileKey, message, clientMeta = {}) {
    const response = await this.client.post(`/files/${fileKey}/comments`, {
      message,
      client_meta: clientMeta,
    });
    return response.data;
  }

  /**
   * Get team projects
   */
  async getTeamProjects(teamId) {
    const response = await this.client.get(`/teams/${teamId}/projects`);
    return response.data;
  }

  /**
   * Test connection
   */
  async testConnection() {
    try {
      const user = await this.getMe();
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          handle: user.handle,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
}

export default FigmaClient;
